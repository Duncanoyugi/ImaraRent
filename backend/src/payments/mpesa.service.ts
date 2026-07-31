import axios from 'axios';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MpesaService {
  private readonly logger = new Logger(MpesaService.name);
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(private readonly config: ConfigService) {}

  async getAccessToken(): Promise<string> {
    // Check if token is still valid
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const consumerKey = this.config.get('MPESA_CONSUMER_KEY');
    const consumerSecret = this.config.get('MPESA_CONSUMER_SECRET');
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
      'base64',
    );

    try {
      const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date();
      this.tokenExpiry.setSeconds(this.tokenExpiry.getSeconds() + 3500); // 58 minutes

      return this.accessToken!;
    } catch (error) {
      this.logger.error(
        'Failed to get M-Pesa access token:',
        error.response?.data || error.message,
      );
      throw new BadRequestException('Failed to initialize M-Pesa payment');
    }
  }

  async initiateStkPush(
    phoneNumber: string,
    amount: number,
    accountReference: string,
  ) {
    const accessToken = await this.getAccessToken();

    const shortcode = this.config.get('MPESA_SHORTCODE');
    const passkey = this.config.get('MPESA_PASSKEY');
    const callbackUrl = this.config.get('MPESA_CALLBACK_URL');

    const timestamp = this.getTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
      'base64',
    );

    const requestData = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phoneNumber,
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackUrl,
      AccountReference: accountReference,
      TransactionDesc: 'Rent Payment',
    };

    try {
      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      this.logger.log(`STK Push initiated: ${response.data.CheckoutRequestID}`);

      return {
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
      };
    } catch (error) {
      this.logger.error(
        'STK Push failed:',
        error.response?.data || error.message,
      );
      throw new BadRequestException('Failed to initiate M-Pesa payment');
    }
  }

  async queryPaymentStatus(checkoutRequestId: string) {
    const accessToken = await this.getAccessToken();

    const shortcode = this.config.get('MPESA_SHORTCODE');
    const passkey = this.config.get('MPESA_PASSKEY');
    const timestamp = this.getTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
      'base64',
    );

    try {
      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
        {
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        'Query payment status failed:',
        error.response?.data || error.message,
      );
      throw new BadRequestException('Failed to query payment status');
    }
  }

  private getTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  validateCallbackSignature(_data: any, _signature: string): boolean {
    // Implement signature validation if required
    // For MVP, we'll skip strict signature validation
    return true;
  }

  parseCallbackMetadata(callbackData: any): {
    amount: number;
    receiptNumber: string;
    transactionDate: string;
    phoneNumber: string;
  } | null {
    try {
      const metadata = callbackData.Body.stkCallback.CallbackMetadata;
      if (!metadata || !metadata.Item) {
        return null;
      }

      const items = metadata.Item;
      const result: any = {};

      items.forEach((item: any) => {
        result[item.Name] = item.Value;
      });

      return {
        amount: Number(result.Amount) || 0,
        receiptNumber: result.MpesaReceiptNumber || '',
        transactionDate: result.TransactionDate || '',
        phoneNumber: result.PhoneNumber || '',
      };
    } catch (error) {
      this.logger.error('Failed to parse callback metadata:', error.message);
      return null;
    }
  }
}
