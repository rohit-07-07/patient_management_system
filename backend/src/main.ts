import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true
    })
  );

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CarePulse API Server</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #0f172a; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 36px; max-width: 520px; width: 100%; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); text-align: center; }
    .status-badge { display: inline-flex; align-items: center; gap: 6px; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
    .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; }
    h1 { font-size: 22px; margin: 0 0 8px; }
    p { color: #64748b; font-size: 14.5px; line-height: 1.5; margin: 0 0 24px; }
    .btn { display: inline-block; background: #0284c7; color: #fff; padding: 11px 22px; border-radius: 8px; text-decoration: none; font-size: 14.5px; font-weight: 600; }
    .endpoints { margin-top: 24px; text-align: left; background: #f8fafc; padding: 16px; border-radius: 8px; font-size: 13px; color: #475569; }
    .endpoints code { color: #0284c7; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <div class="status-badge"><span class="dot"></span> Backend API Server Live</div>
    <h1>CarePulse Hospital API</h1>
    <p>The backend REST service is running healthy. To access the user interface, click below to open the web application.</p>
    <a href="https://patient-management-system-sable-mu.vercel.app" class="btn">Open Web Application UI</a>
    <div class="endpoints">
      <div><strong>REST API Base:</strong> <code>/api</code></div>
      <div style="margin-top: 6px;"><strong>Auth:</strong> <code>POST /api/auth/login</code></div>
      <div style="margin-top: 6px;"><strong>Patients:</strong> <code>GET /api/patients</code></div>
      <div style="margin-top: 6px;"><strong>Invoices:</strong> <code>GET /api/bills</code></div>
    </div>
  </div>
</body>
</html>`);
  });

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
