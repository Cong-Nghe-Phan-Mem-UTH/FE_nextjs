# Hướng dẫn tạo Google OAuth Client ID

## Bước 1: Tạo Project trên Google Cloud Console

1. Truy cập: https://console.cloud.google.com/
2. Đăng nhập bằng tài khoản Google của bạn
3. Click vào dropdown **"Select a project"** ở trên cùng (gần logo Google Cloud)
4. Click **"New Project"**
5. Điền thông tin:
   - **Project name**: Tên project của bạn (ví dụ: "My Restaurant App")
   - **Organization**: Để mặc định (nếu có)
   - **Location**: Chọn organization hoặc "No organization"
6. Click **"Create"**
7. Chờ vài giây để project được tạo, sau đó chọn project vừa tạo

## Bước 2: Bật Google+ API

1. Vào **"APIs & Services"** → **"Library"** (hoặc truy cập: https://console.cloud.google.com/apis/library)
2. Tìm kiếm **"Google+ API"** hoặc **"People API"**
3. Click vào **"Google+ API"** hoặc **"People API"**
4. Click **"Enable"** để bật API

**Lưu ý:** Google+ API đã deprecated, bạn nên sử dụng **"People API"** thay thế. Tuy nhiên, OAuth 2.0 vẫn hoạt động với cả hai.

## Bước 3: Tạo OAuth 2.0 Client ID

### 3.1. Vào OAuth Consent Screen

1. Vào **"APIs & Services"** → **"OAuth consent screen"**
   - Hoặc truy cập: https://console.cloud.google.com/apis/credentials/consent
2. Chọn **"External"** (cho personal/testing) hoặc **"Internal"** (nếu có Google Workspace)
3. Click **"Create"**

### 3.2. Điền thông tin OAuth Consent Screen

**App information:**
- **App name**: Tên ứng dụng của bạn (ví dụ: "Restaurant Management System")
- **User support email**: Email của bạn
- **App logo**: (Tùy chọn) Upload logo nếu có

**App domain:**
- **Application home page**: URL frontend của bạn (ví dụ: `https://fe-nextjs.vercel.app`)
- **Authorized domains**: Thêm domain của bạn (ví dụ: `vercel.app`)

**Developer contact information:**
- **Email addresses**: Email của bạn

4. Click **"Save and Continue"**

**Scopes:**
- Click **"Add or Remove Scopes"**
- Chọn các scopes sau:
  - `userinfo.email`
  - `userinfo.profile`
- Click **"Update"** → **"Save and Continue"**

**Test users:** (Nếu chọn External)
- Thêm email của bạn vào danh sách test users (nếu app chưa được verify)
- Click **"Save and Continue"**

**Summary:**
- Xem lại thông tin và click **"Back to Dashboard"**

### 3.3. Tạo OAuth 2.0 Credentials

1. Vào **"APIs & Services"** → **"Credentials"**
   - Hoặc truy cập: https://console.cloud.google.com/apis/credentials
2. Click **"+ CREATE CREDENTIALS"** ở trên cùng
3. Chọn **"OAuth client ID"**

**Application type:**
- Chọn **"Web application"**

**Name:**
- Đặt tên cho OAuth client (ví dụ: "Next.js Frontend Client")

**Authorized JavaScript origins:**
- Click **"+ ADD URI"**
- Thêm các URL sau:
  - `http://localhost:3000` (cho development)
  - `https://fe-nextjs.vercel.app` (URL production của bạn)
  - `https://*.vercel.app` (cho preview deployments)

**Authorized redirect URIs:**
- Click **"+ ADD URI"**
- Thêm các URL sau:
  - `http://localhost:3000/vi/login` (cho development)
  - `http://localhost:3000/en/login` (cho development)
  - `https://fe-nextjs.vercel.app/vi/login` (URL production)
  - `https://fe-nextjs.vercel.app/en/login` (URL production)
  - `https://*.vercel.app/vi/login` (cho preview deployments)
  - `https://*.vercel.app/en/login` (cho preview deployments)

**Lưu ý:** 
- Thay `fe-nextjs.vercel.app` bằng URL production thực tế của bạn sau khi deploy
- Redirect URI phải khớp **chính xác** với giá trị trong `NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI`

4. Click **"Create"**

## Bước 4: Lấy Client ID

Sau khi tạo xong, Google sẽ hiển thị popup với:
- **Your Client ID**: Copy giá trị này (có dạng: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
- **Your Client Secret**: Không cần thiết cho frontend (chỉ backend cần)

**Copy Client ID** và sử dụng làm giá trị cho `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

## Bước 5: Cấu hình trong Vercel

1. Vào Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Thêm biến:
   - **Key**: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - **Value**: Client ID bạn vừa copy (ví dụ: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
   - **Environment**: Chọn **Production**, **Preview**, và **Development**

3. Thêm biến:
   - **Key**: `NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI`
   - **Value**: `https://fe-nextjs.vercel.app/vi/login` (thay bằng URL production của bạn)
   - **Environment**: Chọn **Production**, **Preview**, và **Development**

## Lưu ý quan trọng

1. **Redirect URI phải khớp chính xác** giữa:
   - Google Cloud Console (Authorized redirect URIs)
   - Environment variable `NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI`
   - URL trong code (đã được cấu hình sẵn trong `login-form.tsx`)

2. **Sau khi deploy lên Vercel**, bạn sẽ có URL production. Cần:
   - Cập nhật lại **Authorized redirect URIs** trong Google Cloud Console
   - Cập nhật lại `NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI` trong Vercel
   - Redeploy để áp dụng thay đổi

3. **Test users**: Nếu app ở chế độ "Testing", chỉ những email trong danh sách test users mới có thể đăng nhập. Để public, cần submit app để Google review (không cần thiết cho development/testing).

4. **Development vs Production**: 
   - Development: Sử dụng `http://localhost:3000`
   - Production: Sử dụng URL Vercel của bạn

## Troubleshooting

### Lỗi: "redirect_uri_mismatch"
- **Nguyên nhân**: Redirect URI trong code không khớp với Google Cloud Console
- **Giải pháp**: Kiểm tra lại `NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI` và Authorized redirect URIs trong Google Cloud Console

### Lỗi: "access_denied"
- **Nguyên nhân**: App chưa được verify hoặc user không trong danh sách test users
- **Giải pháp**: Thêm email vào test users trong OAuth consent screen

### Lỗi: "invalid_client"
- **Nguyên nhân**: Client ID sai hoặc không tồn tại
- **Giải pháp**: Kiểm tra lại Client ID trong Vercel environment variables

## Tài liệu tham khảo

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)



