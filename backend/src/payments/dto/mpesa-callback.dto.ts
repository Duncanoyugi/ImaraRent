import { IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MpesaCallbackDto {
  @ApiProperty()
  @IsObject()
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

export class MpesaCallbackMetadataDto {
  @ApiProperty()
  Amount: number;

  @ApiProperty()
  MpesaReceiptNumber: string;

  @ApiProperty()
  TransactionDate: string;

  @ApiProperty()
  PhoneNumber: string;
}
