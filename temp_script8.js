function activateBottomTab(element) {
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                element.classList.add('active');
            }