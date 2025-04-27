<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
# CRMavto

# API Foydalanish Yo‘riqnomasi (Frontend Ishlab Chiquvchilar Uchun)

Bu yo‘riqnoma backend API’dan foydalanishni tushuntiradi. API foydalanuvchi va filiallarni boshqarish uchun mo‘ljallangan bo‘lib, autentifikatsiya va rollarga asoslangan cheklovlarni qo‘llab-quvvatlaydi. Quyida barcha endpoint’lar, so‘rovlar, javoblar va cheklovlar keltirilgan.

## Umumiy Ma’lumot
- **Base URL:** `http://localhost:3000` (production URL keyinroq taqdim etiladi).
- **Autentifikatsiya:** Barcha endpoint’lar (login’dan tashqari) JWT token talab qiladi. Token `Authorization: Bearer <token>` sarlavhasida yuboriladi.
- **Rollar:**
  - `SUPER_ADMIN`: Barcha imkoniyatlarga ega (foydalanuvchi va filiallarni yaratish, yangilash, o‘chirish).
  - `ADMIN`: Faqat o‘z filialidagi oddiy foydalanuvchilarni (`USER`) boshqaradi. Boshqa `ADMIN` yoki `SUPER_ADMIN` ni yangilay olmaydi yoki o‘chira olmaydi, filial qo‘sha olmaydi.
  - `USER`: Faqat o‘z profilini ko‘ra oladi va yangilay oladi.
- **Content-Type:** Barcha so‘rovlar uchun `Content-Type: application/json`.

## 1. Autentifikatsiya
API’dan foydalanish uchun avval token olish kerak.

### POST /auth/login
Foydalanuvchi tizimga kirish uchun token oladi.

**So‘rov:**
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "laziz123@gmail.com",
  "password": "password"
}
```

**Javob (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "superadmin",
    "email": "laziz123@gmail.com",
    "role": "super_admin",
    "branchId": 1
  }
}
```

**Xato javoblari:**
- `401 Unauthorized`: Email yoki parol noto‘g‘ri.
  ```json
  {
    "statusCode": 401,
    "message": "Email yoki parol noto‘g‘ri",
    "error": "Unauthorized"
  }
  ```

**Maslahatlar:**
- Tokenni localStorage yoki secure cookie’da saqlang.
- Tokenning amal qilish muddati cheklangan bo‘lishi mumkin. Agar `401 Unauthorized` xatosi chiqsa, qayta login qiling.

## 2. Foydalanuvchi Boshqaruvi (/user)
Foydalanuvchi bilan bog‘liq operatsiyalar.

### POST /user
Yangi foydalanuvchi yaratish (faqat `SUPER_ADMIN` uchun).

**So‘rov:**
```
POST http://localhost:3000/user
Authorization: Bearer <super_admin_token>
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "newpassword",
  "role": "user",
  "branchId": 1
}
```

**Javob (201 Created):**
```json
{
  "id": 6,
  "username": "newuser",
  "email": "newuser@example.com",
  "role": "user",
  "branchId": 1,
  "isActive": true,
  "createdAt": "2025-04-27T12:00:00.000Z",
  "updatedAt": "2025-04-27T12:00:00.000Z"
}
```

**Xato javoblari:**
- `403 Forbidden`: Faqat `SUPER_ADMIN` yaratishi mumkin.
- `409 Conflict`: Email yoki username allaqachon mavjud.
  ```json
  {
    "statusCode": 409,
    "message": "Email allaqachon ro‘yxatdan o‘tgan",
    "error": "Conflict"
  }
  ```

### GET /user
Barcha foydalanuvchilarni olish.
- `SUPER_ADMIN`: Barcha foydalanuvchilarni ko‘radi.
- `ADMIN`: Faqat o‘z filialidagi foydalanuvchilarni ko‘radi.

**So‘rov:**
```
GET http://localhost:3000/user
Authorization: Bearer <super_admin_token_or_admin_token>
```

**Javob (200 OK):**
```json
[
  {
    "id": 1,
    "username": "superadmin",
    "email": "laziz123@gmail.com",
    "role": "super_admin",
    "branchId": 1,
    "isActive": true,
    "createdAt": "2025-04-27T12:00:00.000Z",
    "updatedAt": "2025-04-27T12:00:00.000Z",
    "branch": {
      "id": 1,
      "name": "Toshkent filiali",
      "address": "Toshkent sh., Chilanzar"
    }
  },
  ...
]
```

**Xato javoblari:**
- `403 Forbidden`: Faqat `SUPER_ADMIN` yoki `ADMIN` ko‘ra oladi.
- `403 Forbidden`: `ADMIN` uchun filial biriktirilmagan bo‘lsa.

### GET /user/me
Foydalanuvchi o‘z profilini ko‘radi (`SUPER_ADMIN`, `ADMIN`, `USER`).

**So‘rov:**
```
GET http://localhost:3000/user/me
Authorization: Bearer <any_token>
```

**Javob (200 OK):**
```json
{
  "id": 2,
  "username": "admin1",
  "email": "admin1@example.com",
  "role": "admin",
  "branchId": 1,
  "isActive": true,
  "createdAt": "2025-04-27T12:00:00.000Z",
  "updatedAt": "2025-04-27T12:00:00.000Z",
  "branch": {
    "id": 1,
    "name": "Toshkent filiali",
    "address": "Toshkent sh., Chilanzar"
  }
}
```

**Xato javoblari:**
- `401 Unauthorized`: Token noto‘g‘ri yoki muddati o‘tgan.

### GET /user/:id
Muayyan foydalanuvchini ko‘rish.
- `SUPER_ADMIN`: Istalgan foydalanuvchini ko‘radi.
- `ADMIN`: Faqat o‘z filialidagi foydalanuvchilarni ko‘radi.

**So‘rov:**
```
GET http://localhost:3000/user/4
Authorization: Bearer <super_admin_token_or_admin_token>
```

**Javob (200 OK):**
```json
{
  "id": 4,
  "username": "user1",
  "email": "user1@example.com",
  "role": "user",
  "branchId": 1,
  "isActive": true,
  "createdAt": "2025-04-27T12:00:00.000Z",
  "updatedAt": "2025-04-27T12:00:00.000Z",
  "branch": {
    "id": 1,
    "name": "Toshkent filiali",
    "address": "Toshkent sh., Chilanzar"
  }
}
```

**Xato javoblari:**
- `403 Forbidden`: `ADMIN` boshqa filialdagi foydalanuvchini ko‘rishga urinmoqda.
- `404 Not Found`: Foydalanuvchi topilmadi.

### PATCH /user/:id
Foydalanuvchi ma’lumotlarini yangilash.
- `SUPER_ADMIN`: Istalgan foydalanuvchini yangilaydi.
- `ADMIN`: O‘zini yoki o‘z filialidagi `USER` rolli foydalanuvchilarni yangilaydi. Boshqa `ADMIN` yoki `SUPER_ADMIN` ni yangilay olmaydi.
- `USER`: Faqat o‘zini yangilaydi.

**So‘rov:**
```
PATCH http://localhost:3000/user/4
Authorization: Bearer <super_admin_token_or_admin_token>
Content-Type: application/json

{
  "username": "user1_updated",
  "password": "newpassword"
}
```

**Javob (200 OK):**
```json
{
  "id": 4,
  "username": "user1_updated",
  "email": "user1@example.com",
  "role": "user",
  "branchId": 1,
  "isActive": true,
  "createdAt": "2025-04-27T12:00:00.000Z",
  "updatedAt": "2025-04-27T12:05:00.000Z"
}
```

**Xato javoblari:**
- `403 Forbidden`: `ADMIN` boshqa `ADMIN` yoki `SUPER_ADMIN` ni yangilamoqchi bo‘lsa.
  ```json
  {
    "statusCode": 403,
    "message": "Siz boshqa admin yoki super_admin foydalanuvchilarni yangilay olmaysiz",
    "error": "Forbidden"
  }
  ```
- `403 Forbidden`: `ADMIN` boshqa filialdagi foydalanuvchini yangilamoqchi bo‘lsa.
- `404 Not Found`: Foydalanuvchi topilmadi.

### DELETE /user/:id
Foydalanuvchini o‘chirish.
- `SUPER_ADMIN`: Istalgan foydalanuvchini o‘chiradi.
- `ADMIN`: O‘z filialidagi `USER` rolli foydalanuvchilarni o‘chiradi. O‘zini, boshqa `ADMIN` yoki `SUPER_ADMIN` ni o‘chira olmaydi.

**So‘rov:**
```
DELETE http://localhost:3000/user/4
Authorization: Bearer <super_admin_token_or_admin_token>
```

**Javob (200 OK):**
```json
{
  "message": "Foydalanuvchi o‘chirildi"
}
```

**Xato javoblari:**
- `403 Forbidden`: `ADMIN` o‘zini o‘chirmoqchi bo‘lsa.
  ```json
  {
    "statusCode": 403,
    "message": "Siz o‘zingizni o‘chira olmaysiz",
    "error": "Forbidden"
  }
  ```
- `403 Forbidden`: `ADMIN` boshqa `ADMIN` yoki `SUPER_ADMIN` ni o‘chirmoqchi bo‘lsa.
- `403 Forbidden`: `ADMIN` boshqa filialdagi foydalanuvchini o‘chirmoqchi bo‘lsa.
- `404 Not Found`: Foydalanuvchi topilmadi.

### GET /user/count/all
Umumiy foydalanuvchilar sonini olish.
- `SUPER_ADMIN`: Barcha foydalanuvchilarni hisoblaydi.
- `ADMIN`: O‘z filialidagi foydalanuvchilarni hisoblaydi.

**So‘rov:**
```
GET http://localhost:3000/user/count/all
Authorization: Bearer <super_admin_token_or_admin_token>
```

**Javob (200 OK):**
```json
{
  "totalUsers": 5
}
```

**Xato javoblari:**
- `403 Forbidden`: Faqat `SUPER_ADMIN` yoki `ADMIN` hisoblay oladi.

### GET /user/count/admins
Admin foydalanuvchilar sonini olish.
- `SUPER_ADMIN`: Barcha adminlarni hisoblaydi.
- `ADMIN`: O‘z filialidagi adminlarni hisoblaydi.

**So‘rov:**
```
GET http://localhost:3000/user/count/admins
Authorization: Bearer <super_admin_token_or_admin_token>
```

**Javob (200 OK):**
```json
{
  "totalAdmins": 2
}
```

**Xato javoblari:**
- `403 Forbidden`: Faqat `SUPER_ADMIN` yoki `ADMIN` hisoblay oladi.

## 3. Filial Boshqaruvi (/branch)
Filiallar bilan bog‘liq operatsiyalar.

### POST /branch
Yangi filial yaratish (faqat `SUPER_ADMIN` uchun).

**So‘rov:**
```
POST http://localhost:3000/branch
Authorization: Bearer <super_admin_token>
Content-Type: application/json

{
  "name": "Andijon filiali",
  "address": "Andijon sh., Navoiy ko‘chasi",
  "phone": "+998901234569"
}
```

**Javob (201 Created):**
```json
{
  "id": 3,
  "name": "Andijon filiali",
  "address": "Andijon sh., Navoiy ko‘chasi",
  "phone": "+998901234569",
  "isActive": true,
  "createdAt": "2025-04-27T12:00:00.000Z",
  "updatedAt": "2025-04-27T12:00:00.000Z"
}
```

**Xato javoblari:**
- `403 Forbidden`: Faqat `SUPER_ADMIN` yaratishi mumkin.
  ```json
  {
    "statusCode": 403,
    "message": "Sizda bu amalni bajarish uchun ruxsat yo‘q",
    "error": "Forbidden"
  }
  ```
- `409 Conflict`: Filial nomi allaqachon mavjud.

### GET /branch
Barcha filiallarni olish.
- `SUPER_ADMIN`: Barcha filiallarni ko‘radi.
- `ADMIN`: O‘z filialidagi filiallarni ko‘radi (hozirda faqat o‘z `branchId` si).

**So‘rov:**
```
GET http://localhost:3000/branch
Authorization: Bearer <super_admin_token_or_admin_token>
```

**Javob (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Toshkent filiali",
    "address": "Toshkent sh., Chilanzar",
    "phone": "+998901234567",
    "isActive": true,
    "createdAt": "2025-04-27T12:00:00.000Z",
    "updatedAt": "2025-04-27T12:00:00.000Z"
  },
  ...
]
```

**Xato javoblari:**
- `403 Forbidden`: Faqat `SUPER_ADMIN` yoki `ADMIN` ko‘ra oladi.
- `403 Forbidden`: `ADMIN` uchun filial biriktirilmagan bo‘lsa.

### GET /branch/:id
Muayyan filialni ko‘rish.
- `SUPER_ADMIN`: Istalgan filialni ko‘radi.
- `ADMIN`: O‘z filialidagi filialni ko‘radi.

**So‘rov:**
```
GET http://localhost:3000/branch/1
Authorization: Bearer <super_admin_token_or_admin_token>
```

**Javob (200 OK):**
```json
{
  "id": 1,
  "name": "Toshkent filiali",
  "address": "Toshkent sh., Chilanzar",
  "phone": "+998901234567",
  "isActive": true,
  "createdAt": "2025-04-27T12:00:00.000Z",
  "updatedAt": "2025-04-27T12:00:00.000Z"
}
```

**Xato javoblari:**
- `403 Forbidden`: `ADMIN` boshqa filialni ko‘rishga urinmoqda.
- `404 Not Found`: Filial topilmadi.

### PATCH /branch/:id
Filial ma’lumotlarini yangilash.
- `SUPER_ADMIN`: Istalgan filialni yangilaydi.
- `ADMIN`: O‘z filialidagi filialni yangilaydi.

**So‘rov:**
```
PATCH http://localhost:3000/branch/1
Authorization: Bearer <super_admin_token_or_admin_token>
Content-Type: application/json

{
  "name": "Toshkent filiali yangilangan",
  "phone": "+998901234570"
}
```

**Javob (200 OK):**
```json
{
  "id": 1,
  "name": "Toshkent filiali yangilangan",
  "address": "Toshkent sh., Chilanzar",
  "phone": "+998901234570",
  "isActive": true,
  "createdAt": "2025-04-27T12:00:00.000Z",
  "updatedAt": "2025-04-27T12:05:00.000Z"
}
```

**Xato javoblari:**
- `403 Forbidden`: `ADMIN` boshqa filialni yangilamoqchi bo‘lsa.
- `404 Not Found`: Filial topilmadi.
- `409 Conflict`: Yangi nom allaqachon mavjud.

### DELETE /branch/:id
Filialni o‘chirish.
- `SUPER_ADMIN`: Istalgan filialni o‘chiradi.
- `ADMIN`: O‘z filialidagi filialni o‘chiradi.

**So‘rov:**
```
DELETE http://localhost:3000/branch/1
Authorization: Bearer <super_admin_token_or_admin_token>
```

**Javob (200 OK):**
```json
{
  "message": "Filial o‘chirildi"
}
```

**Xato javoblari:**
- `403 Forbidden`: `ADMIN` boshqa filialni o‘chirmoqchi bo‘lsa.
- `404 Not Found`: Filial topilmadi.

## 4. Xato Kodlari
Quyidagi xato kodlari API javoblarida qaytadi:
- `400 Bad Request`: So‘rovdagi ma’lumotlar noto‘g‘ri (masalan, majburiy maydonlar yo‘q).
- `401 Unauthorized`: Token yo‘q, noto‘g‘ri, yoki muddati o‘tgan.
- `403 Forbidden`: Foydalanuvchida ruxsat yo‘q (masalan, `ADMIN` cheklangan amalni bajarmoqchi).
- `404 Not Found`: Resurs (foydalanuvchi yoki filial) topilmadi.
- `409 Conflict`: Ma’lumotlar ziddiyatli (masalan, email yoki filial nomi allaqachon mavjud).
- `500 Internal Server Error`: Serverda xato (loglarni backend jamoasiga yuboring).

## 5. Qo‘shimcha Maslahatlar
- **Token boshqaruvi:**
  - Tokenni `localStorage` yoki `HttpOnly` cookie’da saqlang.
  - `401 Unauthorized` xatosi chiqsa, foydalanuvchini login sahifasiga yo‘naltiring.
- **So‘rovlar:**
  - Har bir so‘rovda `Authorization: Bearer <token>` sarlavhasini qo‘shing.
  - `PATCH` so‘rovlarida faqat o‘zgartiriladigan maydonlarni yuboring.
- **Xatolarni ko‘rsatish:**
  - Xato xabarlarini (`message` maydoni) foydalanuvchiga tushunarli shaklda ko‘rsating (masalan, “Siz boshqa adminni yangilay olmaysiz”).
- **Filial va foydalanuvchi bog‘lanishi:**
  - `branchId` foydalanuvchilar va filiallarni bog‘laydi. `ADMIN` faqat o‘z `branchId` dagi resurslar bilan ishlaydi.
- **Test ma’lumotlari:**
  - Test uchun quyidagi foydalanuvchilardan foydalaning:
    - `SUPER_ADMIN`: `laziz123@gmail.com` (parol: `password`)
    - `ADMIN`: `admin1@example.com` (parol: `password`)
    - `USER`: `user1@example.com` (parol: `password`)

## 6. Qo‘shimcha Eslatmalar
- Agar `create-user.dto.ts` yoki `update-user.dto.ts` dagi maydonlar haqida aniq ma’lumot kerak bo‘lsa, backend jamoasidan so‘rang.
- `sales` kabi qo‘shimcha funksiyalar keyingi bosqichlarda qo‘shilishi mumkin.
- Har qanday muammo bo‘lsa, backend jamoasiga loglar bilan murojaat qiling (`logs/error.log`).

**Savollar bo‘lsa, backend jamoasiga yozing!** 🚀