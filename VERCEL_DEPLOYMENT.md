# Hướng dẫn Deploy Next.js Frontend lên Vercel

## Yêu cầu trước khi deploy

1. Tài khoản Vercel (đăng ký tại https://vercel.com)
2. Repository code đã được push lên GitHub/GitLab/Bitbucket
3. Backend API đã được deploy và có URL công khai
4. Google OAuth credentials (Tùy chọn - chỉ cần nếu bạn muốn sử dụng đăng nhập bằng Google)

## Các bước deploy

### Bước 1: Chuẩn bị Environment Variables

Bạn cần cấu hình các biến môi trường sau trong Vercel:

#### 1.1. Truy cập Vercel Dashboard

- Đăng nhập vào https://vercel.com
- Chọn project hoặc tạo project mới

#### 1.2. Thêm Environment Variables

Vào **Settings** → **Environment Variables** và thêm các biến sau:

```
NEXT_PUBLIC_API_ENDPOINT=https://your-backend-api-url.com
NEXT_PUBLIC_URL=https://your-frontend-url.vercel.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com (Tùy chọn)
NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI=https://your-frontend-url.vercel.app/vi/login (Tùy chọn)
```

**Lưu ý:**

- `NEXT_PUBLIC_API_ENDPOINT`: **BẮT BUỘC** - URL của backend API (ví dụ: `https://your-backend.vercel.app` hoặc `https://api.yourdomain.com`)
- `NEXT_PUBLIC_URL`: **BẮT BUỘC** - URL của frontend sau khi deploy (sẽ có dạng `https://your-project.vercel.app`)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: **TÙY CHỌN** - Client ID từ Google Cloud Console. Chỉ cần nếu bạn muốn sử dụng đăng nhập bằng Google. Nếu không có, nút "Login with Google" sẽ không hiển thị.
- `NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI`: **TÙY CHỌN** - Redirect URI đã cấu hình trong Google Cloud Console (phải khớp chính xác). Chỉ cần nếu bạn sử dụng Google OAuth.

### Bước 2: Deploy qua Vercel Dashboard

#### 2.1. Import Project

1. Vào https://vercel.com/new
2. Chọn **Import Git Repository**
3. Chọn repository chứa code Next.js của bạn
4. Click **Import**

#### 2.2. Cấu hình Project

- **Framework Preset**: Next.js (tự động detect)
- **Root Directory**: `./` (hoặc để mặc định)
- **Build Command**: `npm run build` (mặc định)
- **Output Directory**: **ĐỂ TRỐNG** hoặc `.next` (KHÔNG đặt thành "Next.js default")
- **Install Command**: `npm install` (mặc định)

**⚠️ QUAN TRỌNG:** Nếu bạn thấy lỗi `routes-manifest.json couldn't be found`, hãy:

1. Vào **Settings** → **General** → **Build & Development Settings**
2. Tìm **Output Directory**
3. **Xóa** giá trị "Next.js default" nếu có
4. Để **trống** hoặc đặt là `.next`
5. Click **Save** và redeploy

#### 2.3. Thêm Environment Variables

- Thêm tất cả các biến môi trường đã chuẩn bị ở Bước 1.2
- Chọn **Environment** cho mỗi biến:
  - **Production**: Chọn cho production
  - **Preview**: Chọn cho preview deployments
  - **Development**: Chọn cho development (nếu cần)

#### 2.4. Deploy

1. Click **Deploy**
2. Chờ quá trình build và deploy hoàn tất
3. Vercel sẽ tự động cung cấp URL cho bạn

### Bước 3: Cấu hình Custom Domain (Tùy chọn)

Nếu bạn muốn sử dụng domain riêng:

1. Vào **Settings** → **Domains**
2. Thêm domain của bạn
3. Cấu hình DNS theo hướng dẫn của Vercel
4. Cập nhật lại `NEXT_PUBLIC_URL` và `NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI` với domain mới

### Bước 4: Kiểm tra và Test

Sau khi deploy xong:

1. **Kiểm tra build logs**: Xem có lỗi nào không
2. **Test các chức năng chính**:
   - Đăng nhập/Đăng xuất
   - OAuth Google (nếu có)
   - Các API calls đến backend
   - Upload images (nếu có)
   - Đa ngôn ngữ (vi/en)

### Bước 5: Cấu hình Google OAuth (Nếu có)

Nếu bạn sử dụng Google OAuth:

1. Vào Google Cloud Console
2. Vào **APIs & Services** → **Credentials**
3. Chỉnh sửa OAuth 2.0 Client ID
4. Thêm **Authorized redirect URIs**:
   - `https://your-frontend-url.vercel.app/vi/login`
   - `https://your-frontend-url.vercel.app/en/login`
   - (Nếu có custom domain, thêm cả domain đó)

## Troubleshooting

### Lỗi: "Các khai báo biến môi trường không hợp lệ"

- **Nguyên nhân**: Thiếu hoặc sai environment variables
- **Giải pháp**: Kiểm tra lại tất cả các biến trong Vercel Dashboard → Settings → Environment Variables

### Lỗi: Images không load được

- **Nguyên nhân**: Backend hostname chưa được thêm vào `remotePatterns` trong `next.config.ts`
- **Giải pháp**: File `next.config.ts` đã được cập nhật để tự động lấy hostname từ `NEXT_PUBLIC_API_ENDPOINT`. Đảm bảo biến này được cấu hình đúng.

### Lỗi: CORS khi gọi API

- **Nguyên nhân**: Backend chưa cho phép domain frontend
- **Giải pháp**: Cấu hình CORS ở backend để cho phép domain Vercel của bạn

### Lỗi: Cookies không hoạt động

- **Nguyên nhân**: Cookies được set với `secure: true` nhưng đang chạy trên HTTP
- **Giải pháp**: Vercel tự động cung cấp HTTPS, nhưng nếu có vấn đề, kiểm tra lại cấu hình cookies trong code

### Lỗi: "routes-manifest.json couldn't be found"

- **Nguyên nhân**: Output Directory trong Vercel Dashboard bị cấu hình sai
- **Giải pháp**:
  1. Vào Vercel Dashboard → Project → **Settings** → **General**
  2. Tìm phần **Build & Development Settings**
  3. Đảm bảo **Output Directory** để trống hoặc là `.next` (KHÔNG phải "Next.js default")
  4. Hoặc file `vercel.json` đã được tạo để tự động cấu hình đúng
  5. Redeploy lại project

## Cấu trúc Environment Variables

```bash
# Backend API Endpoint (BẮT BUỘC)
NEXT_PUBLIC_API_ENDPOINT=https://your-backend-api-url.com

# Frontend URL (BẮT BUỘC)
NEXT_PUBLIC_URL=https://your-frontend-url.vercel.app

# Google OAuth Client ID (TÙY CHỌN - chỉ cần nếu muốn dùng Google Login)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Google OAuth Authorized Redirect URI (TÙY CHỌN - chỉ cần nếu muốn dùng Google Login)
NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI=https://your-frontend-url.vercel.app/vi/login
```

**Lưu ý:** Google OAuth là **TÙY CHỌN**. Bạn có thể deploy và sử dụng ứng dụng mà không cần Google OAuth. Người dùng vẫn có thể đăng nhập bằng email/password bình thường. Nếu không cấu hình Google OAuth, nút "Login with Google" sẽ tự động ẩn đi.

## Lưu ý quan trọng

1. **Tất cả biến môi trường bắt đầu bằng `NEXT_PUBLIC_`** sẽ được expose ra client-side. Không đặt sensitive data vào đây.

2. **Sau khi thay đổi environment variables**, bạn cần **redeploy** để áp dụng thay đổi.

3. **Build time vs Runtime**: Environment variables được inject vào build time. Nếu thay đổi sau khi build, cần rebuild.

4. **Preview Deployments**: Mỗi pull request sẽ tạo một preview deployment riêng. Có thể cấu hình environment variables riêng cho preview.

5. **Production URL**: Sau khi deploy lần đầu, bạn sẽ có URL dạng `https://your-project.vercel.app`. Cập nhật lại `NEXT_PUBLIC_URL` và `NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI` với URL này.

## Tài liệu tham khảo

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
