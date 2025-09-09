# CodeMindSet
Mô tả 3 bài tập code 

Bài 1: Tasks API (NestJS)

1) Giới thiệu

API quản lý Task theo mô hình MVC dùng NestJS + TypeORM (SQLite).
Mỗi task gồm: id (UUID), title, description, status ("To Do" | "In Progress" | "Done"), createdAt.

2) Chạy dự án
# Vào Bài 1 
cd Bai1_API
# cài deps
npm install

# chạy dev
npm run start:dev

Server mặc định: http://localhost:3000
Prefix API: /api
Swagger UI: http://localhost:3000/api/docs
Postman: Test bằng postman
CSDL: SQLite

3) Kiến trúc & Thư mục
src/
  main/
    app/
      main.ts             # bootstrap, global pipes, Swagger
      module.ts           # AppModule gốc
      taskModule.ts       # Module cho domain Task
    controller/
      taskController.ts   # REST endpoints cho Task
    exception/
      badRequestException.ts
      httpExceptionFilter.ts
      internalException.ts
      notFoundException.ts
    model/
      dto/
        createTaskDto.ts
        taskDto.ts
        updateTaskDto.ts
      entity/
        type/
          taskType.ts     # enum TaskStatus
          baseEntity.ts   # entity cơ sở (timestamps,…)
        taskEntity.ts     # schema Task (TypeORM)
      mapper/
        taskMapper.ts     # map giữa Entity <-> DTO
    repository/
      taskRepository.ts   # repository cho Task
    service/
      baseService.ts      # service cơ sở
      taskService.ts      # business logic cho Task


4) Mô hình dữ liệu
// TaskStatus
"To Do" | "In Progress" | "Done"

5) Endpoints chính

Base URL: http://localhost:3000/api

Method	
POST	    /tasks	      Tạo task
GET         /tasks	      Lấy danh sách task
GET	        /tasks/:id	  Lấy task theo ID
PATCH	    /tasks/:id	  Cập nhật task
DELETE	    /tasks/:id	  Xoá task

Ví dụ: Tạo task

POST /api/tasks
{
  "title": "Viết báo cáo",
  "description": "Báo cáo tuần"
}

{
  "id": "f9e5...-uuid",
  "title": "Viết báo cáo",
  "description": "Báo cáo tuần",
  "status": "To Do",
  "createdAt": "2025-09-08T12:34:56.000Z",
  "updatedAt": "2025-09-08T12:34:56.000Z"
}

7) Swagger
Mở trình duyệt đến http://localhost:3000/api/docs để thử toàn bộ endpoints.

8) Ghi chú kỹ thuật
Validation: class-validator + DTO (bắt buộc title khi tạo; status phải nằm trong enum).
Hiệu năng: các truy vấn GET đơn giản, thời gian đáp ứng <200ms trên máy local.
Clean code: phân tách Controller/Service/Repository/Mapper rõ ràng, DTO & Enum riêng.
DB: SQLite đơn giản để chấm bài; có thể chuyển sang Postgres/MySQL bằng sửa TypeOrmModule.forRoot.



Bài 2: Fibonacci
1. Mục tiêu:
Viết hàm tính số Fibonacci thứ 50 (F(50)) bằng JavaScript.
Tối ưu bằng Dynamic Programming (iterative hoặc memoization).
Sử dụng BigInt để xử lý số lớn.
Đảm bảo thời gian chạy trung bình < 1ms trên CPU 2.5 GHz.

2. Cách thực hiện 
Bước 1:  cd Bai2_fibonacci
Bước 2: node fibonacci.js

3. phân tích:
Phân tích độ phức tạp
fibDP (Dynamic Programming) Có:

Thời gian: O(n)
Bộ nhớ: O(1)

fibMemo (Memoization) Có:
Thời gian: O(n)
Bộ nhớ: O(n)

Với n = 50, cả hai đều nhanh, nhưng fibDP tối ưu hơn do sử dụng ít bộ nhớ.


Bài 3:  Phát triển Server Game
1. Mục tiêu 
Đánh giá khả năng xây dựng server game cơ bản với NestJS, tập trung vào quản lý tài khoản và hai
trò chơi: Line 98 và Cờ Caro X O.

Tính năng chính bao gồm: 

Đăng ký / đăng nhập (username + password), mã hoá bcrypt, trả về JWT.
/user/me trả thông tin người dùng từ JWT.

Game 1: Line 98
Lưới 9×9, sinh bóng, di chuyển, tự xoá 5 bóng cùng màu theo hàng/ngang/dọc/chéo, tính điểm.
Trạng thái game lưu ở server; API REST + cập nhật realtime qua Socket.IO.

Game 2: Caro XO
Bàn cờ 15×15; ghép cặp ngẫu nhiên 2 người chơi qua namespace /caro.
Đánh X/O theo lượt; kiểm tra thắng 5 quân liên tiếp; thông báo gameOver.
Menu chọn game và 2 trang UI độc lập cho từng game.

2. Cách thực hiện

Bước 1:  cd Bai3_GameServer
Bước 2: npm install
Bước 3: npm run start:dev
Bước 4: Mặc định server chạy ở http://localhost:3000

3. Mẹo & xử lý lỗi thường gặp

401 Unauthorized khi gọi /auth/login
Kiểm tra payload đúng {username,password} và server đang chạy. Sau khi login, UI sẽ lưu JWT; mọi API khác phải kèm Authorization: Bearer <token>.

Đăng ký báo SQLITE_CONSTRAINT: UNIQUE (username)
Username đã tồn tại. Dùng tên khác hoặc xoá file db.sqlite để reset dữ liệu.

Không ghép cặp được (Caro)
Đảm bảo 2 tab đã đăng nhập khác tài khoản; mỗi tab bấm Find Match một lần; xem Console/network để thấy event matchFound. Nếu dùng guard JWT cho namespace, cần truyền token khi tạo socket:
io('/caro', { auth: { token: '<JWT>' } }).

Lỗi module không tìm thấy dist/main
Chạy dev với npm run start:dev, hoặc build trước khi start:prod: npm run build.

