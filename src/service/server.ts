import express, { Request, Response, NextFunction } from 'express';

const app = express();

// Middleware ที่ตรวจสอบ log ของ request
const loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`Request URL: ${req.url}`);
  console.log(`Request Method: ${req.method}`);
  next(); // ให้ไปยัง middleware หรือ route ถัดไป
};

app.get('/error', (req: Request, res: Response) => {
    throw new Error('Something went wrong!');
});

// Middleware ที่ตรวจสอบเวลาของ request
const timeMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`Time: ${new Date().toISOString()}`);
  next();
};

// Middleware สำหรับจัดการข้อผิดพลาด
const errorHandlingMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    // console.error(`Error: ${err.message}`); // log ข้อผิดพลาดลง console
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  };

// ใช้ Middleware ทั้งสองตัวในแอป
app.use(loggerMiddleware);
app.use(timeMiddleware);

// Route ตัวอย่าง
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Middleware with TypeScript!');
});

// เริ่มต้นเซิร์ฟเวอร์
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});