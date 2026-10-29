(() => {
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const cfg = window.GIA_AN_CONFIG || {};
let method = "phone", selected = null;
const money = n => new Intl.NumberFormat("vi-VN").format(n) + "đ";
$("#year").textContent = new Date().getFullYear();
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2600)}
function open(id){$("#"+id).hidden=false;document.body.style.overflow="hidden"}
function close(id){$("#"+id).hidden=true;document.body.style.overflow=""}
$$("[data-close]").forEach(b=>b.addEventListener("click",()=>close(b.dataset.close)));
$$(".overlay").forEach(o=>o.addEventListener("click",e=>{if(e.target===o)close(o.id)}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")$$(".overlay").forEach(o=>{if(!o.hidden)close(o.id)})});
$("#menuToggle").addEventListener("click",()=>$("#nav").classList.toggle("open"));
$$("nav a").forEach(a=>a.addEventListener("click",()=>$("#nav").classList.remove("open")));
$("#accountOpen").addEventListener("click",()=>{restoreAccount();open("accountModal")});
function restoreAccount(){const a=getAccount();if(a){setMethod(a.method||"phone");$("#accountValue").value=a.value||"";$("#accountName").value=a.name||"";$("#accountStatus").textContent="Hồ sơ được lưu trên thiết bị này."}}
function getAccount(){try{return JSON.parse(localStorage.getItem("gaProfile")||"null")}catch{return null}}
function setMethod(m){method=m;$$(".tab").forEach(b=>b.classList.toggle("active",b.dataset.method===m));$("#accountLabel").textContent=m==="phone"?"Số điện thoại":"ID LINE";$("#accountValue").placeholder=m==="phone"?"Nhập số điện thoại":"Nhập ID LINE";$("#accountValue").setAttribute("autocomplete",m==="phone"?"tel":"off")}
$$(".tab").forEach(b=>b.addEventListener("click",()=>setMethod(b.dataset.method)));
$("#accountForm").addEventListener("submit",e=>{e.preventDefault();const value=$("#accountValue").value.trim();if(!value)return;if(method==="phone"&&!/^[+()\\d\\s.-]{7,25}$/.test(value)){ $("#accountStatus").textContent="Vui lòng kiểm tra lại số điện thoại.";return}
try{localStorage.setItem("gaProfile",JSON.stringify({method,value,name:$("#accountName").value.trim()}));$("#accountStatus").textContent="Đã lưu hồ sơ trên thiết bị này.";$("#buyerName").value=$("#accountName").value.trim();$("#buyerContact").value=value;toast("Đã lưu thông tin liên hệ");setTimeout(()=>{close("accountModal");if(selected)startOrder()},350)}catch{$("#accountStatus").textContent="Không thể lưu trong trình duyệt này. Bạn vẫn có thể tiếp tục đặt hàng."}});
$$(".buy").forEach(b=>b.addEventListener("click",()=>{selected={plan:b.dataset.plan,price:Number(b.dataset.price)};const a=getAccount();if(!a){open("accountModal");$("#accountStatus").textContent="Nhập thông tin liên hệ để tiếp tục đặt hàng.";return}startOrder()}));
function startOrder(){if(!selected)return;$("#chosenName").textContent=selected.plan;$("#chosenPrice").textContent=money(selected.price);$("#orderForm").hidden=false;$("#orderResult").hidden=true;const a=getAccount();if(a){$("#buyerName").value=a.name||"";$("#buyerContact").value=a.value||""}open("orderModal")}
$("#orderForm").addEventListener("submit",e=>{e.preventDefault();if(!selected)return;const order={code:"GA"+Date.now().toString().slice(-8),plan:selected.plan,price:selected.price,name:$("#buyerName").value.trim(),contact:$("#buyerContact").value.trim(),locket:$("#locketUser").value.trim(),note:$("#buyerNote").value.trim(),created:new Date().toLocaleString("vi-VN")};
const message=[`YÊU CẦU ĐẶT HÀNG — ${cfg.storeName||"Gia An Locket Gold"}`,`Mã yêu cầu: ${order.code}`,`Gói dịch vụ: ${order.plan}`,`Giá dự kiến: ${money(order.price)}`,`Tên khách: ${order.name}`,`Liên hệ: ${order.contact}`,`Username Locket: ${order.locket||"Chưa cung cấp"}`,`Ghi chú: ${order.note||"Không có"}`,`Thời gian: ${order.created}`,"Lưu ý: vui lòng xác nhận giá và điều kiện trước khi thanh toán."].join("\\n");
$("#orderMessage").value=message;$("#resultSummary").textContent=`Mã ${order.code} · ${order.plan} · ${money(order.price)}.`;$("#orderForm").hidden=true;$("#orderResult").hidden=false;
const line=$("#lineLink"), help=$("#lineHelp");if(cfg.lineProfileUrl&&/^https:\\/\\/line\\.me\\//.test(cfg.lineProfileUrl)){line.href=cfg.lineProfileUrl;line.hidden=false;help.textContent="Nội dung đơn đã được tạo. Sao chép trước, sau đó mở LINE và dán tin nhắn vào cuộc trò chuyện với Gia An."}else{line.hidden=true;help.textContent="Chủ website chưa cấu hình URL LINE. Hãy sao chép đơn hàng; sau đó liên hệ người bán qua kênh đã được cung cấp."}
});
$("#copyOrder").addEventListener("click",async()=>{const text=$("#orderMessage").value;try{await navigator.clipboard.writeText(text);toast("Đã sao chép đơn hàng")}catch{$("#orderMessage").select();toast("Hãy nhấn giữ nội dung để sao chép")}});
})();