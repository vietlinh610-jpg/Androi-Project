package com.dqd.hust.quanlychungcu.utils

object JavascriptScripts {

    // JS để bơm Token vào LocalStorage
    fun getAuthInjection(token: String, role: String, userId: String, fullName: String): String {
        val userInfoJson = """{"id":"$userId","hoTen":"$fullName","quyen":"$role"}"""
        return """
            javascript:(function() {
                localStorage.setItem('userToken', '$token');
                localStorage.setItem('userRole', '$role');
                localStorage.setItem('userID', '$userId'); 
                localStorage.setItem('fullName', '$fullName');
            })()
        """.trimIndent()
    }

    // JS để sửa giao diện (ẩn sidebar, fix height...)
    val DASHBOARD_FIX_UI = """
        javascript:(function() { 
            // 1. Ép Viewport
            var meta = document.querySelector('meta[name="viewport"]');
            if (!meta) { meta = document.createElement('meta'); meta.name = 'viewport'; document.head.appendChild(meta); }
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            
            // 2. Ẩn Sidebar & Header
            var sidebars = document.getElementsByClassName('sidebar-container');
            if (sidebars.length > 0) sidebars[0].style.display = 'none';
            var navs = document.getElementsByTagName('nav');
            if (navs.length > 0) navs[0].style.display = 'none';
            
            // 3. Khóa chiều cao 100vh
            document.documentElement.style.height = '100vh';
            document.documentElement.style.width = '100vw';
            document.documentElement.style.overflow = 'hidden';
            document.body.style.height = '100vh';
            document.body.style.overflow = 'hidden';

            // 4. Bật cuộn cho nội dung chính
            var root = document.getElementById('root') || document.body.firstElementChild;
            if(root) {
                root.style.height = '100%';
                root.style.overflowY = 'auto';
                
                var main = document.getElementsByTagName('main');
                if(main.length > 0) { 
                    main[0].style.marginLeft = '0'; 
                    main[0].style.width = '100%';
                    main[0].style.height = '100%';
                }
            }
        })()
    """.trimIndent()
}