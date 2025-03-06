// 检查脚本是否加载成功
console.log("script.js 文件已加载");

// 获取当前日期并格式化为 YYMMDD
function getCurrentDateYYMMDD() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// 页面加载时自动填充默认日期
window.onload = () => {
  const dateInput = document.getElementById("date");
  dateInput.value = getCurrentDateYYMMDD();
};

async function generate() {
  console.log("生成二维码按钮被点击");

  const goodsIdInput = document.getElementById("goodsId").value.trim();
  const dateInput = document.getElementById("date").value.trim();
  const goodsIds = goodsIdInput.split(',').map(id => id.trim());
  const outputDiv = document.getElementById("output");

  if (!goodsIdInput || !dateInput) {
    alert("请输入商品 ID 和日期！");
    return;
  }

  outputDiv.innerHTML = "";

  for (const goodsId of goodsIds) {
    try {
      const imageUrl = `https://union.lizhi.io/partner/product/${goodsId}/poster?cid=53qvofdc`;
      console.log("开始请求图片:", imageUrl);

      const response = await fetch(imageUrl);
      console.log("图片请求响应:", response);

      if (!response.ok) {
        throw new Error(`无法获取商品 ${goodsId} 的图片`);
      }

      const imageBlob = await response.blob();
      const imageUrlObject = URL.createObjectURL(imageBlob);
      console.log("Blob URL 被设置:", imageUrlObject);

      // 后续代码同之前逻辑...
    } catch (error) {
      console.error("发生错误:", error);
    }
  }
}
