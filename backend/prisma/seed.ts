import { PrismaClient, NotificationType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding notification templates...');

  const templates = [
    {
      type: NotificationType.TENANT_INVITATION,
      templatePath: 'email/tenant-invitation.hbs',
      subject: 'Welcome to ImaraRent - Complete Your Registration',
      content: `<!DOCTYPE html>
<html>
<head>
  <title>Welcome to ImaraRent</title>
</head>
<body>
  <h1>Welcome {{firstName}}!</h1>
  <p>You have been invited to join {{organizationName}} as a tenant at {{propertyName}} (Unit {{unitNumber}}).</p>
  <a href="{{invitationLink}}">Complete Registration</a>
  <p>This link expires in 7 days.</p>
</body>
</html>`,
      description: 'Sent when a tenant is invited to join the platform',
    },
    {
      type: NotificationType.RENT_DUE,
      templatePath: 'email/invoice.hbs',
      subject: 'Rent Invoice - {{invoiceNumber}}',
      content: `<!DOCTYPE html>
<html>
<head>
  <title>Invoice {{invoiceNumber}}</title>
</head>
<body>
  <h1>Invoice {{invoiceNumber}}</h1>
  <p>Tenant: {{tenantName}}</p>
  <p>Amount: {{formatCurrency totalAmount}}</p>
  <p>Due Date: {{formatDate dueDate}}</p>
  <a href="{{paymentLink}}">Pay Now</a>
</body>
</html>`,
      description: 'Sent when a rent invoice is generated',
    },
    {
      type: NotificationType.PAYMENT_RECEIVED,
      templatePath: 'email/payment-receipt.hbs',
      subject: 'Payment Confirmation - {{receiptNumber}}',
      content: `<!DOCTYPE html>
<html>
<head>
  <title>Payment Receipt</title>
</head>
<body>
  <h1>Payment Received</h1>
  <p>Amount: {{formatCurrency amount}}</p>
  <p>Reference: {{receiptNumber}}</p>
  <p>Date: {{formatDate paymentDate}}</p>
</body>
</html>`,
      description: 'Sent when a payment is received',
    },
    {
      type: NotificationType.LEASE_EXPIRING,
      templatePath: 'email/lease-expiring.hbs',
      subject: 'Lease Expiring Soon',
      content: `<!DOCTYPE html>
<html>
<head>
  <title>Lease Expiring</title>
</head>
<body>
  <h1>Lease Expiring Soon</h1>
  <p>Your lease at {{propertyName}} expires on {{formatDate endDate}}.</p>
  <p>Please contact your property manager to renew.</p>
</body>
</html>`,
      description: 'Sent when a lease is about to expire',
    },
    {
      type: NotificationType.MAINTENANCE_UPDATE,
      templatePath: 'email/maintenance-update.hbs',
      subject: 'Maintenance Request Update',
      content: `<!DOCTYPE html>
<html>
<head>
  <title>Maintenance Update</title>
</head>
<body>
  <h1>Maintenance Request Status Update</h1>
  <p>Request: {{ticketTitle}}</p>
  <p>Status: {{status}}</p>
  <p>{{message}}</p>
</body>
</html>`,
      description: 'Sent when a maintenance request status changes',
    },
    {
      type: NotificationType.ANNOUNCEMENT,
      templatePath: 'email/announcement.hbs',
      subject: 'Important Announcement',
      content: `<!DOCTYPE html>
<html>
<head>
  <title>Announcement</title>
</head>
<body>
  <h1>{{title}}</h1>
  <p>{{message}}</p>
</body>
</html>`,
      description: 'Sent for general announcements',
    },
  ];

  for (const template of templates) {
    try {
      await prisma.notificationTemplate.upsert({
        where: { type: template.type },
        update: template,
        create: template,
      });
      console.log(`✅ ${template.type} template seeded`);
    } catch (error: any) {
      console.error(`❌ Failed to seed ${template.type}:`, error.message);
    }
  }

  console.log('🎉 All templates seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
