# Mì Cay Chaebol — micaychaebol.com

Website tĩnh của quán Mì Cay Chaebol, chạy bằng GitHub Pages từ nhánh `main` (thư mục gốc), domain trong file `CNAME`.

## Sửa thực đơn và giá

Chỉ cần sửa **`menu.js`**. Mỗi món là một dòng:

```js
{ name: "Mì Kim chi Chaebol", price: 79, pick: true, note: "Tôm, mực, bò Mỹ, chả cá, cá viên, xúc xích" },
```

- `price`: giá tính bằng nghìn đồng (`79` = 79.000đ). Để `null` nếu chưa có giá (web hiện "Hỏi quán").
- `pick: true`: món quán khuyên dùng (nhãn "Quán gợi ý").
- `new: true`: món mới (nhãn "Mới").
- `note`, `ko`: mô tả nhỏ và tên tiếng Hàn, không bắt buộc.

Sửa xong thì commit và push lên `main`, khoảng 1–2 phút sau web tự cập nhật. Menu cho Google (schema.org) cũng được tạo từ file này.

## Cấu trúc

- `index.html`: nội dung trang, thông tin SEO (title, mô tả, Open Graph, schema.org Restaurant)
- `style.css`: giao diện
- `menu.js`: dữ liệu thực đơn
- `app.js`: hiện thực đơn, trạng thái "Đang mở cửa" theo giờ Việt Nam (10:00–21:30)
- `assets/img/`: ảnh đã tối ưu (WebP) dùng trên web, ảnh chia sẻ `og.jpg`, icon
- `assets/`: ảnh gốc (logo, linh vật, ảnh món)

## Đổi giờ mở cửa

Giờ nằm ở 3 chỗ: `app.js` (`OPEN_MIN`, `CLOSE_MIN`), `index.html` (dòng "Mở cửa 10:00 – 21:30", thẻ meta description và khối `openingHoursSpecification`).

## Ảnh cần bổ sung

Tìm `data-todo` trong `index.html`: khối đó đang giữ chỗ cho ảnh mặt tiền quán.
