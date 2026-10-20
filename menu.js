/*
  THỰC ĐƠN MÌ CAY CHAEBOL
  ------------------------------------------------------------
  Đây là file duy nhất cần sửa khi đổi món hoặc đổi giá.

  - price: giá tính bằng nghìn đồng (39 = 39.000đ). Để null nếu chưa có giá.
  - note:  dòng mô tả nhỏ dưới tên món (không bắt buộc).
  - ko:    tên tiếng Hàn hiện cạnh tên món (không bắt buộc).
  - pick:  true = món quán khuyên dùng (hiện nhãn "Quán gợi ý").
  - new:   true = món mới (hiện nhãn "Mới").

  Sửa xong thì lưu file, commit và push lên GitHub là web tự cập nhật.
  Lưu ý giữ đúng dấu phẩy, ngoặc kép và ngoặc nhọn như các dòng mẫu.
*/
window.CHAEBOL_MENU = {
  combos: [
    { name: "Combo 1", title: "SOLO", tail: "bùng vị", price: 89,
      items: "Mì cay Chaebol + Trà tắc" },
    { name: "Combo 2", title: "GÀ KHOAI", tail: "chill đã", price: 80,
      items: "Đùi gà rán + Khoai tây lắc phô mai + Pepsi" },
    { name: "Combo 3", title: "SONG MÌ", tail: "đỉnh thính", price: 179,
      items: "Mì cay Chaebol + Mì sốt spaghetti + Khoai tây lắc phô mai + 2 Trà tắc" },
    { name: "Combo 4", title: "ĐẠI TIỆC", tail: "Chaebol", price: 209,
      items: "Mì cay Chaebol + Cơm bò sốt Bulgogi + Khoai tây lắc phô mai + 2 Trà tắc" }
  ],

  special: {
    name: "Special offer", title: "LẨU TOMYUM", tail: "Chaebol", price: 199,
    items: "Lẩu 2 người, vị Tomyum chua cay thơm béo, đầy đặn topping tôm, mực, bò Mỹ, chả cá, cá viên và xúc xích."
  },

  groups: [
    {
      id: "mi-cay", name: "Mì cay", ko: "라면",
      photo: "assets/img/mi-cay-720.webp",
      photoAlt: "Nồi mì cay Chaebol với tôm, kim chi, bông cải và cá viên trên bàn gỗ ở quán",
      sections: [
        { items: [
          { name: "Mì Kim chi Xúc xích Cá viên", price: 39 },
          { name: "Mì Kim chi Rau nấm", price: 39 },
          { name: "Mì Kim chi Bò Mỹ", price: 59 },
          { name: "Mì Kim chi Hải sản", price: 69, note: "Tôm, mực, bò Mỹ, chả cá, xúc xích" },
          { name: "Mì Kim chi Chaebol", price: 79, pick: true, note: "Tôm, mực, bò Mỹ, chả cá, cá viên, xúc xích" },
          { name: "Mì Tomyum Chaebol", price: 79, new: true, note: "Tôm, mực, bò Mỹ, chả cá, cá viên, xúc xích" },
          { name: "Mì Cà chua Chaebol", price: 79, new: true, note: "Tôm, mực, bò Mỹ, chả cá, cá viên, xúc xích" }
        ] }
      ],
      extras: {
        title: "Món thêm",
        items: [
          { name: "Tôm / mực / bò / gà", price: 22 },
          { name: "Mì", price: 19 },
          { name: "Cơm", price: 15 },
          { name: "Xúc xích / Cá viên", price: 15 },
          { name: "Kim chi", price: 15 },
          { name: "Bông cải xanh / Nấm kim châm / Bắp cải tím", price: 15 }
        ]
      }
    },
    {
      id: "ga-ran", name: "Gà rán", ko: "치킨",
      photo: "assets/img/ga-ran-720.webp",
      photoAlt: "Gà rán không xương rắc mè trong khay vàng, chụp tại quán",
      sections: [
        { title: "Gà rán không xương", items: [
          { name: "Vị truyền thống", price: 49 },
          { name: "Sốt cay Hàn Quốc", price: 59 },
          { name: "Lắc phô mai", price: 69, pick: true }
        ] },
        { title: "Đùi gà rán", new: true, items: [
          { name: "Vị truyền thống", price: 35 },
          { name: "Sốt cay Hàn Quốc", price: 40 }
        ] }
      ]
    },
    {
      id: "mon-han", name: "Món Hàn", ko: "한식",
      sections: [
        { items: [
          { name: "Cơm đùi gà", ko: "닭다리 덮밥", price: 39, new: true },
          { name: "Mì sốt spaghetti", ko: "스파게티", price: 45, new: true },
          { name: "Miến trộn", ko: "잡채", price: 59 },
          { name: "Bánh gạo xào cay / không cay", ko: "떡볶이", price: 59 },
          { name: "Cơm trộn", ko: "비빔밥", price: 69 },
          { name: "Cơm bò sốt Bulgogi", ko: "불고기덮밥", price: 69, pick: true },
          { name: "Thịt heo chiên sốt chua ngọt", ko: "탕수육", price: 69, pick: true }
        ] }
      ]
    },
    {
      id: "mon-chien", name: "Món chiên", ko: "튀김",
      sections: [
        { items: [
          { name: "Khoai tây chiên", price: 32 },
          { name: "Khoai tây chiên lắc phô mai", price: 35 },
          { name: "Phô mai que", price: 39 }
        ] }
      ]
    },
    {
      id: "thuc-uong", name: "Thức uống", ko: "음료",
      sections: [
        { items: [
          { name: "Trà sữa truyền thống", price: 20 },
          { name: "Trà đào", price: 29 },
          { name: "Trà chanh / Trà tắc", price: 19 },
          { name: "Trà atiso", price: 29, new: true },
          { name: "Trà Ô long", price: 20 },
          { name: "Nước ngọt", price: 20, note: "Pepsi, Sting, 7up" },
          { name: "Nước suối", price: 15 }
        ] }
      ]
    }
  ]
};
