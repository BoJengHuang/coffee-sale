// Google Form 設定
const GOOGLE_FORM_BASE_URL = "https://docs.google.com/forms/d/e/1FAIpQLScjJODuzwSRnEz2pYDB-RmnGjvpS3rRmlNY8cLVlQNhEv9bMw/viewform";
const FORM_ENTRY_ID = "entry.1825989806"; // 這是您要在 Google 表單網址中尋找的「訂單明細」對應 ID，例如 entry.123456789

const PRODUCTS = {
    coffeeBeans: {
        id: 'coffee',
        name: '咖啡豆 (250g)',
        price: 700,
        options: [
            "ILIFA 香草醇香咖啡豆",
            "ILIFA 榛果醇香咖啡豆",
            "ILIFA 非洲象果醇香咖啡豆",
            "ILIFA 非洲蜂蜜醇香咖啡豆",
            "ILIFA 夏威夷果醇香咖啡豆",
            "ILIFA 太妃醇香咖啡豆",
            "ILIFA 非洲早晨南非精品配方咖啡豆"
        ]
    },
    dripBags: {
        id: 'drip',
        name: '咖啡濾掛包 (十入盒裝)',
        price: 550,
        options: [
            "ILIFA 香草醇香咖啡濾掛包",
            "ILIFA 榛果醇香咖啡濾掛包",
            "ILIFA 非洲象果醇香咖啡濾掛包",
            "ILIFA 非洲蜂蜜醇香咖啡濾掛包",
            "ILIFA 夏威夷果醇香咖啡濾掛包",
            "ILIFA 太妃醇香咖啡濾掛包",
            "ILIFA 非洲早晨南非精品配方咖啡濾掛包"
        ]
    },
    honey: {
        id: 'honey',
        name: '天然蜂蜜 (340g)',
        price: 1180,
        options: [
            "ILIFA 柑橘花蜂蜜",
            "ILIFA 藍莓花蜂蜜",
            "ILIFA 南非珍花蜂蜜",
            "ILIFA 生命之樹花蜂蜜",
            "ILIFA 夏威夷果花蜂蜜",
            "ILIFA 蘆薈花蜂蜜",
            "ILIFA 向日葵蜂蜜",
            "ILIFA 酪梨花蜂蜜"
        ]
    }
};

const GIFT_BOXES = {
    box1: {
        id: 'box1',
        name: '禮盒1: (蜂蜜+蜂蜜)',
        price: 1880,
        selections: [
            { label: '第一罐蜂蜜', type: 'honey' },
            { label: '第二罐蜂蜜', type: 'honey' }
        ]
    },
    box2: {
        id: 'box2',
        name: '禮盒2: (蜂蜜+咖啡豆)',
        price: 1750,
        selections: [
            { label: '蜂蜜', type: 'honey' },
            { label: '咖啡豆', type: 'coffeeBeans' }
        ]
    },
    box3: {
        id: 'box3',
        name: '禮盒3: (蜂蜜+咖啡濾掛包)',
        price: 1600,
        selections: [
            { label: '蜂蜜', type: 'honey' },
            { label: '咖啡濾掛包', type: 'dripBags' }
        ]
    }
};

// State Management
let singleItemsCart = []; // [{ key: "coffeeBeans_1", category: 'coffeeBeans', optionIndex: 1, quantity: 0 }]
let giftBoxesCart = [];   // [{ id: 'gb_123', typeId: 'box1', selections: ['honey_1', 'honey_2'], name: '...' }]

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initSingleProducts();
    setupEventListeners();
    updateCart();
});

// Render Single Products List
function initSingleProducts() {
    const container = document.getElementById('single-products-container');
    container.innerHTML = '';

    Object.keys(PRODUCTS).forEach(categoryKey => {
        const productData = PRODUCTS[categoryKey];

        const categoryHeader = document.createElement('h3');
        categoryHeader.className = 'category-title';
        categoryHeader.innerText = productData.name;
        container.appendChild(categoryHeader);

        const categoryGrid = document.createElement('div');
        categoryGrid.className = 'products-grid category-grid';

        productData.options.forEach((optionName, index) => {
            const itemKey = `${categoryKey}_${index}`;
            // Initialize state for item
            singleItemsCart.push({
                key: itemKey,
                category: categoryKey,
                optionName: optionName,
                price: productData.price,
                quantity: 0
            });

            // Create UI
            const card = document.createElement('div');
            card.className = 'product-item';
            card.innerHTML = `
                <div class="product-info">
                    <h3>${optionName}</h3>
                    <div class="product-price">${productData.price} NTD</div>
                </div>
                <div class="qty-control">
                    <button class="qty-btn" onclick="updateSingleItemQty('${itemKey}', -1)">-</button>
                    <input type="text" class="qty-input" id="qty_${itemKey}" value="0" readonly>
                    <button class="qty-btn" onclick="updateSingleItemQty('${itemKey}', 1)">+</button>
                </div>
            `;
            categoryGrid.appendChild(card);
        });
        container.appendChild(categoryGrid);
    });
}

function updateSingleItemQty(itemKey, delta) {
    const item = singleItemsCart.find(i => i.key === itemKey);
    if (!item) return;

    let newQty = item.quantity + delta;
    if (newQty < 0) newQty = 0;

    item.quantity = newQty;
    document.getElementById(`qty_${itemKey}`).value = newQty;

    updateCart();
}

function setupEventListeners() {
    // Add Gift Box
    document.getElementById('add-gift-box-btn').addEventListener('click', () => {
        const select = document.getElementById('gift-box-type-select');
        const boxTypeId = select.value;

        if (!boxTypeId) {
            alert('請先選擇一種禮盒類型！');
            return;
        }

        addGiftBox(boxTypeId);
        // Reset select to placeholder
        select.value = '';
    });

    // Generate Order
    document.getElementById('generate-order-btn').addEventListener('click', generateOrderSummary);
}

function addGiftBox(boxTypeId) {
    const boxDef = GIFT_BOXES[boxTypeId];
    const uniqueId = 'gb_' + Date.now() + Math.floor(Math.random() * 1000);

    // Initialize default selections (index 0 of each required list)
    let initialSelections = boxDef.selections.map(sel => 0);

    giftBoxesCart.push({
        id: uniqueId,
        typeId: boxTypeId,
        name: boxDef.name,
        price: boxDef.price,
        selections: initialSelections,
        quantity: 1
    });

    renderGiftBoxes();
    updateCart();
}

function removeGiftBox(uniqueId) {
    giftBoxesCart = giftBoxesCart.filter(gb => gb.id !== uniqueId);
    renderGiftBoxes();
    updateCart();
}

function updateGiftBoxSelection(uniqueId, selectionIndex, optionIndex) {
    const box = giftBoxesCart.find(gb => gb.id === uniqueId);
    if (box) {
        box.selections[selectionIndex] = parseInt(optionIndex);
        updateCart();
    }
}

function updateGiftBoxQty(uniqueId, delta) {
    const box = giftBoxesCart.find(gb => gb.id === uniqueId);
    if (!box) return;

    let newQty = box.quantity + delta;
    if (newQty < 1) newQty = 1; // Minimum 1 for gift boxes, remove button handles deletion

    box.quantity = newQty;
    document.getElementById(`gb_qty_${uniqueId}`).value = newQty;

    updateCart();
}

function renderGiftBoxes() {
    const listContainer = document.getElementById('gift-boxes-list');
    listContainer.innerHTML = '';

    if (giftBoxesCart.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center; color: var(--text-muted); font-size: 0.95rem;">尚未新增任何禮盒</p>';
        return;
    }

    giftBoxesCart.forEach((box, index) => {
        const boxDef = GIFT_BOXES[box.typeId];

        const boxEl = document.createElement('div');
        boxEl.className = 'gift-box-item';

        let selectionsHTML = '';
        boxDef.selections.forEach((selItem, sIndex) => {
            const optionsList = PRODUCTS[selItem.type].options;

            let optionsHTML = '';
            optionsList.forEach((optName, optIdx) => {
                const selected = box.selections[sIndex] === optIdx ? 'selected' : '';
                optionsHTML += `<option value="${optIdx}" ${selected}>${optName}</option>`;
            });

            selectionsHTML += `
                <div class="selection-group">
                    <label>${selItem.label}</label>
                    <select class="form-select" onchange="updateGiftBoxSelection('${box.id}', ${sIndex}, this.value)">
                        ${optionsHTML}
                    </select>
                </div>
            `;
        });

        boxEl.innerHTML = `
            <div class="gift-box-header">
                <div>
                    <span class="gift-box-title">組合 ${index + 1}: ${box.name}</span>
                    <span style="display:block; font-size: 0.9rem; color: var(--text-muted); margin-top:2px;">單價: ${box.price} NTD</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="qty-control" style="width: auto; border: 1px solid var(--border-color); border-radius: 6px; padding: 2px;">
                        <button class="qty-btn" style="width: 28px; height: 28px;" onclick="updateGiftBoxQty('${box.id}', -1)">-</button>
                        <input type="text" class="qty-input" style="width: 40px;" id="gb_qty_${box.id}" value="${box.quantity}" readonly>
                        <button class="qty-btn" style="width: 28px; height: 28px;" onclick="updateGiftBoxQty('${box.id}', 1)">+</button>
                    </div>
                    <button class="remove-box-btn" onclick="removeGiftBox('${box.id}')">移除</button>
                </div>
            </div>
            <div class="box-options-grid">
                ${selectionsHTML}
            </div>
        `;
        listContainer.appendChild(boxEl);
    });
}

function updateCart() {
    let subtotal = 0;

    // Calculate Single Items
    singleItemsCart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    // Calculate Gift Boxes
    giftBoxesCart.forEach(box => {
        subtotal += box.price * box.quantity;
    });

    let shippingFee = 0;
    const shippingRow = document.getElementById('shipping-row');

    // Shipping logic: free if over 1000, else 65
    if (subtotal === 0) {
        shippingFee = 0;
        shippingRow.style.display = 'none';
    } else if (subtotal < 1000) {
        shippingFee = 65;
        shippingRow.style.display = 'flex';
        shippingRow.innerHTML = `<span>運費 (未滿1000元):</span><span id="shipping-fee">65 NTD</span>`;
    } else {
        shippingFee = 0;
        shippingRow.style.display = 'flex';
        shippingRow.innerHTML = `<span>運費:</span><span id="shipping-fee" style="color: #2e7d32; font-weight: 600;">已達免運門檻 (0 NTD)</span>`;
    }

    const total = subtotal + shippingFee;

    document.getElementById('subtotal-price').innerText = `${subtotal} NTD`;
    document.getElementById('total-price').innerText = `${total} NTD`;
}

function generateOrderSummary() {
    let subtotal = 0;
    let orderLines = [];

    // Header
    orderLines.push("=== 扶青慈善義賣 購物明細 ===");

    // Single Items
    const purchasedItems = singleItemsCart.filter(item => item.quantity > 0);
    if (purchasedItems.length > 0) {
        purchasedItems.forEach(item => {
            const lineTotal = item.price * item.quantity;
            subtotal += lineTotal;
            // 格式化為: [單品] 咖啡豆名 x 數目 (小計)
            orderLines.push(`[單品] ${item.optionName} x ${item.quantity} (小計: ${lineTotal})`);
        });
    }

    // Gift Boxes
    if (giftBoxesCart.length > 0) {
        giftBoxesCart.forEach((box) => {
            const lineTotal = box.price * box.quantity;
            subtotal += lineTotal;
            const boxDef = GIFT_BOXES[box.typeId];

            // 擷取選擇的明細組成一行
            const selDetails = boxDef.selections.map((selItem, sIndex) => {
                const optIdx = box.selections[sIndex];
                const optName = PRODUCTS[selItem.type].options[optIdx];
                return `${selItem.label}: ${optName.split(' ')[1] || optName}`; // 嘗試簡化名稱避免太長
            }).join('、');

            // 格式化為: [禮盒1] (蜂蜜:A、蜂蜜:B) x 數目 (小計)
            orderLines.push(`[${box.name.split(':')[0]}] (${selDetails}) x ${box.quantity} (小計: ${lineTotal})`);
        });
    }

    if (subtotal === 0) {
        alert("您的購物車是空的，請先選擇商品再結帳！");
        return;
    }

    // Shipping & Total
    let shipping = subtotal < 1000 ? 65 : 0;
    let total = subtotal + shipping;

    orderLines.push("\n===========================");
    orderLines.push(`商品總額: ${subtotal} NTD`);
    orderLines.push(`運費: ${shipping} NTD ${shipping === 0 ? '(滿千免運)' : '(未滿1000元)'}`);
    orderLines.push(`總計應付: ${total} NTD`);
    orderLines.push("===========================");

    const textToCopy = orderLines.join('\n');

    // Check if Google Form logic is configured
    if (GOOGLE_FORM_BASE_URL.includes("您的表單代碼") || FORM_ENTRY_ID.includes("您的欄位ID")) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert("⚠️ 系統提示：\n您尚未在 app.js 中設定 Google 表單網址！\n\n系統已暫停自動跳轉功能，改為暫時為您「複製訂單明細」。\n（請將 app.js 第一行的 GOOGLE_FORM_BASE_URL 與 FORM_ENTRY_ID 更換為您的表單網址與欄位ID，即可啟用自動填單跳轉）");
        }).catch(err => {
            alert("複製失敗，請手動圈選以下文字複製：\n\n" + textToCopy);
        });
        return;
    }

    // Copy to clipboard just in case
    try { navigator.clipboard.writeText(textToCopy); } catch (e) { }

    // Open Google Form
    const encodedText = encodeURIComponent(textToCopy);
    const prefilledUrl = `${GOOGLE_FORM_BASE_URL}?${FORM_ENTRY_ID}=${encodedText}`;
    window.open(prefilledUrl, '_blank');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').innerText = message;

    toast.classList.remove('hidden');
    // small delay to allow reflow for transition
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 400); // Wait for transition
    }, 3000);
}
