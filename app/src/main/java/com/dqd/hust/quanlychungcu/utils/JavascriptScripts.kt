package com.dqd.hust.quanlychungcu.utils

object JavascriptScripts {

    // 1. Hàm Inject Token (Giữ nguyên, rất chuẩn)
    fun getAuthInjection(token: String, role: String, userId: String, fullName: String): String {
        return """
            javascript:(function() {
                localStorage.setItem('userToken', '$token');
                localStorage.setItem('userRole', '$role');
                localStorage.setItem('userID', '$userId'); 
                localStorage.setItem('fullName', '$fullName');
            })()
        """.trimIndent()
    }

    // 2. Hàm Fix UI (ĐÃ NÂNG CẤP)
    // Sử dụng thẻ <style> để tự động thích nghi Dọc/Ngang
    val DASHBOARD_FIX_UI = """
        javascript:(function() { 
            // A. Cấu hình Viewport (Bắt buộc để không bị Zoom nhỏ xíu)
            var meta = document.querySelector('meta[name="viewport"]');
            if (!meta) { 
                meta = document.createElement('meta'); 
                meta.name = 'viewport'; 
                document.head.appendChild(meta); 
            }
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            
            // B. Tạo thẻ CSS Style (Đây là chìa khóa xử lý xoay màn hình)
            var css = `
                /* --- CẤU HÌNH CHUNG --- */
                /* Ẩn Sidebar và Header của Web gốc */
                .sidebar-container, nav, header { display: none !important; }
                
                /* Đẩy nội dung chính ra full màn hình */
                main { margin-left: 0 !important; width: 100% !important; padding: 10px !important; }
                
                /* Reset margin body */
                body { margin: 0; padding: 0; width: 100vw; }

                /* --- TRƯỜNG HỢP 1: MÀN HÌNH DỌC (PORTRAIT) --- */
                /* Khóa cuộn body, chỉ cuộn nội dung bên trong (Trải nghiệm giống App) */
                @media (orientation: portrait) {
                    html, body {
                        height: 100vh;
                        overflow: hidden; /* Không cho cuộn cả trang */
                    }
                    #root, .App {
                        height: 100%;
                        overflow-y: auto; /* Cho phép cuộn nội dung bên trong */
                        -webkit-overflow-scrolling: touch; /* Cuộn mượt trên mobile */
                    }
                }

                /* --- TRƯỜNG HỢP 2: MÀN HÌNH NGANG (LANDSCAPE) --- */
                /* Mở khóa chiều cao để nội dung dàn trải, cuộn bình thường */
                @media (orientation: landscape) {
                    html, body {
                        height: auto; /* Chiều cao tự do theo nội dung */
                        overflow-y: auto; /* Cho phép cuộn cả trang */
                    }
                    #root, .App {
                        height: auto;
                        overflow: visible;
                    }
                }
            `;

            // C. Bơm CSS vào trang
            var style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);

        })()
    """.trimIndent()
}