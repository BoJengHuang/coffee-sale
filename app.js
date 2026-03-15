console.log("ILIFA App Script Loaded");
const FORM_ENTRY_ID = "entry.1825989806"; // 產品明細
const FORM_ENTRY_ID_2 = "entry.687318534"; // 產品明細 (備份)

// 基本資料對應 ID
const ENTRY_CLUB = "entry.1649162359";
const ENTRY_TITLE = "entry.556567269";
const ENTRY_NAME_CN = "entry.195864220";
const ENTRY_NAME_EN = "entry.1810958842";
const ENTRY_PHONE = "entry.625650214";
const ENTRY_ADDRESS = "entry.695755712";
const ENTRY_DELIVERY_MODE = "entry.1965171835";
const ENTRY_PICKUP_TIME = "entry.297668972";
const ENTRY_PAYMENT_INFO = "entry.612393887";
const ENTRY_EMAIL = "entry.783554575";

let isSubmitting = false;

// 注意：原需求中沒給 7, 8 題的實體 ID，程式碼中會嘗試對應，若用戶提供後續可修正常數。

const PRODUCTS = {
    "coffeeBeans": {
        "id": "coffee",
        "name": "咖啡豆 (250g)",
        "price": 700,
        "options": [
            { "name": "ILIFA 香草醇香咖啡豆", "desc": "散發出的香草香氣滑順、甜美，令人聯想到剛出爐的新鮮糕點。\n▶ 豆子來源為坦桑尼亞、肯亞、烏干達等所產的環境友善咖啡豆。" },
            { "name": "ILIFA 榛果醇香咖啡豆", "desc": "帶有堅果般的烘焙香氣，令人聯想到熱騰騰剛烤好、伴隨著焦甜氣味的榛果。" },
            { "name": "ILIFA 非洲象果醇香咖啡豆", "desc": "呈現股異國風情、果香的香氣，讓人聯想到非洲日落時的草原，帶有濃厚的奶香和一絲花香甜味。" },
            { "name": "ILIFA 非洲蜂蜜醇香咖啡豆", "desc": "散發出的淡淡花蜜香氣很令人驚喜，聯想到的是春天盛開的花野叢林，明亮且輕盈，真摯的甜甜氣味。" },
            { "name": "ILIFA 夏威夷果醇香咖啡豆", "desc": "散發出夏威夷果特有的奶油香氣，豐富而柔滑，口感圓潤且飽滿。" },
            { "name": "ILIFA 太妃醇香咖啡豆", "desc": "散發濃郁溫暖的焦糖與奶油氣息，如同初冬午後在暖爐旁享用的太妃糖點心。" },
            { "name": "ILIFA 非洲早晨南非精品配方咖啡豆", "desc": "捕捉了非洲大地黎明時分的清新氣息，令人聯想到朝露覆蓋的叢林與草原。\n▶ 呈現巧克力、堅果、焦糖、莓果等甜酸味，尾韻帶有特殊煙燻香氣回甘。" }
        ]
    },
    "dripBags": {
        "id": "drip",
        "name": "咖啡濾掛包 (十入盒裝)",
        "price": 550,
        "options": [
            { "name": "ILIFA 香草醇香咖啡濾掛包（十入盒裝）", "desc": "散發出的香草香氣滑順、甜美，令人聯想到剛出爐的新鮮糕點。\n▶ 採用100%優質阿拉比卡單品咖啡豆。" },
            { "name": "ILIFA 榛果醇香咖啡濾掛包（十入盒裝）", "desc": "帶有堅果般的烘焙香氣，令人聯想到熱騰騰剛烤好、伴隨著焦甜氣味的榛果。" },
            { "name": "ILIFA 非洲象果醇香咖啡濾掛包（十入盒裝）", "desc": "呈現股異國風情、果香的香氣，讓人聯想到非洲日落時的草原，帶有濃厚的奶香和一絲花香甜味。" },
            { "name": "ILIFA 非洲蜂蜜醇香咖啡濾掛包（十入盒裝）", "desc": "散發出的淡淡花蜜香氣很令人驚喜，聯想到的是春天盛開的花野叢林，明亮且輕盈，真摯的甜甜氣味。" },
            { "name": "ILIFA 夏威夷果醇香咖啡濾掛包（十入盒裝）", "desc": "散發出夏威夷果特有的奶油香氣，豐富而柔滑，口感圓潤且飽滿。" },
            { "name": "ILIFA 太妃醇香咖啡濾掛包（十入盒裝）", "desc": "散發濃郁溫暖的焦糖與奶油氣息，如同初冬午後在暖爐旁享用的太妃糖點心。" },
            { "name": "ILIFA 非洲早晨南非精品配方咖啡濾掛包（十入盒裝）", "desc": "捕捉了非洲大地黎明時分的清新氣息，令人聯想到朝露覆蓋的叢林與草原。\n▶ 呈現巧克力、堅果、焦糖、莓果等甜酸味。" }
        ]
    },
    "honey": {
        "id": "honey",
        "name": "天然蜂蜜 (340g)",
        "price": 1180,
        "options": [
            { "name": "ILIFA 柑橘花蜂蜜", "desc": "柑橘類花蜜製成的蜂蜜具有明亮的柑橘水果味，散發出清新的酸甜滋味。\n▶ SGS實驗室驗證100%純天然蜂蜜。" },
            { "name": "ILIFA 藍莓花蜂蜜", "desc": "藍莓花蜜製成，味道濃郁甜度高，尾韻帶莓果香。\n▶ SGS實驗室驗證100%純天然生蜂蜜。" },
            { "name": "ILIFA 南非珍花蜂蜜", "desc": "Fynbos花系具豐富草本和野花香，伴著堅果和山地植物的獨特風味。" },
            { "name": "ILIFA 生命之樹花蜂蜜", "desc": "淡淡的花香但味道卻像麥芽、堅果般厚實，甜度較低，尾韻濃郁。" },
            { "name": "ILIFA 夏威夷果花蜂蜜", "desc": "夏威夷果花蜂蜜散發出獨特的堅果香氣，彷彿微風拂過陽光下的果園，溫潤而帶有淡淡的焦糖與太妃糖韻味。" },
            { "name": "ILIFA 蘆薈花蜂蜜", "desc": "蘆薈花蜂蜜散發出輕柔的花香，像微風吹過草地時的那份清爽，讓人感覺純粹又自然。" },
            { "name": "ILIFA 向日葵蜂蜜", "desc": "向日葵花蜂蜜散發明亮而清新的香氣，彷彿晨曦灑落金黃花田時的暖陽氣息，甜美中帶有一絲淡淡的草本清爽。" },
            { "name": "ILIFA 酪梨花蜂蜜", "desc": "酪梨花蜂蜜帶有濃郁而深邃的香氣，彷彿午後陽光灑落樹梢時的溫潤氣息，醇厚中透著一絲大地的沉穩。" }
        ]
    }
};

const GIFT_BOXES = {
    box1: {
        id: 'box1',
        name: '禮盒1: (蜂蜜+蜂蜜)',
        imageName: 'ILIFA 精選兩入蜂蜜禮盒組合',
        desc: '自行搭配兩瓶ILIFA南非頂級野生生蜂蜜。\n▶ 附送ILIFA黑卡燙金logo大提袋一個。',
        price: 1880,
        selections: [
            { label: '第一罐蜂蜜', type: 'honey' },
            { label: '第二罐蜂蜜', type: 'honey' }
        ]
    },
    box2: {
        id: 'box2',
        name: '禮盒2: (蜂蜜+咖啡豆)',
        imageName: 'ILIFA 精選咖啡蜂蜜禮盒組合（蜂蜜＆咖啡豆）',
        desc: '自行搭配一瓶南非頂級野生生蜂蜜（340g）與ILIFA醇香咖啡豆（250g）。\n▶ 附送ILIFA黑卡燙金logo大提袋一個。',
        price: 1750,
        selections: [
            { label: '蜂蜜', type: 'honey' },
            { label: '咖啡豆', type: 'coffeeBeans' }
        ]
    },
    box3: {
        id: 'box3',
        name: '禮盒3: (蜂蜜+咖啡濾掛包)',
        imageName: 'ILIFA 精選咖啡蜂蜜禮盒組合(蜂蜜&咖啡濾掛包)',
        desc: '自行搭配一瓶南非頂級野生生蜂蜜與ILIFA醇香咖啡濾掛包（十入盒裝）。\n▶ 附送ILIFA黑卡燙金logo大提袋一個。',
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
    loadCart();
    initSingleProducts();
    setupEventListeners();
    updateCart(); // also saves cart

    // Add Submit listener
    const submitBtn = document.getElementById('submit-order-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => submitOrder());
    }
});

// UI Helpers
function togglePickupTime(show) {
    const group = document.getElementById('pickup-time-group');
    if (group) {
        group.style.display = show ? 'block' : 'none';
    }
}

function switchPayment(method) {
    // Tabs
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.innerText.includes(method === 'transfer' ? '轉帳' : 'LinePay')) {
            tab.classList.add('active');
        }
    });

    // Boxes
    document.getElementById('payment-transfer-box').classList.remove('active');
    document.getElementById('payment-linepay-box').classList.remove('active');

    if (method === 'transfer') {
        document.getElementById('payment-transfer-box').classList.add('active');
    } else {
        document.getElementById('payment-linepay-box').classList.add('active');
    }
}

// Global tap-to-close and scroll-to-close handler for bio cards
function closeAllDetailCards() {
    const activeModals = document.querySelectorAll('.global-modal.active');
    if (activeModals.length === 0) return;

    activeModals.forEach(modal => {
        modal.classList.remove('active');
    });
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) backdrop.classList.remove('active');
}

function showProductDetail(name, desc, imgName) {
    const modal = document.getElementById('product-detail-modal');
    const content = document.getElementById('modal-body-content');
    const backdrop = document.getElementById('modal-backdrop');

    content.innerHTML = `
        <img src="assets/${imgName}.png" alt="${name}" class="modal-img" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
        <div class="modal-title">${name}</div>
        <div class="modal-desc">${desc.replace(/\n/g, '<br>')}</div>
    `;

    modal.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
}

// Click listener is often more reliable on mobile for "tap to dismiss"
document.addEventListener('click', (e) => {
    const isInfoIcon = e.target.closest('.info-icon');
    const isModalContent = e.target.closest('.global-modal-content');
    const isBackdrop = e.target.id === 'modal-backdrop';

    // Check if modal is active first
    if (document.querySelector('.global-modal.active')) {
        if ((!isInfoIcon && !isModalContent) || isBackdrop) {
            closeAllDetailCards();
        }
    }
});

// Extra sensitive scroll detection for dismissal
window.addEventListener('scroll', () => {
    if (document.querySelector('.global-modal.active')) {
        closeAllDetailCards();
    }
}, { passive: true });

function saveCart() {
    localStorage.setItem('shoppingCartSingleItems', JSON.stringify(singleItemsCart));
    localStorage.setItem('shoppingCartGiftBoxes', JSON.stringify(giftBoxesCart));
}

function loadCart() {
    const s = localStorage.getItem('shoppingCartSingleItems');
    const g = localStorage.getItem('shoppingCartGiftBoxes');
    if (s) singleItemsCart = JSON.parse(s);
    if (g) giftBoxesCart = JSON.parse(g);
    // If there is data in gift boxes, render it immediately
    if (giftBoxesCart.length > 0) renderGiftBoxes();
}

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

        productData.options.forEach((option, index) => {
            const optionName = option.name;
            const optionDesc = option.desc;
            const itemKey = `${categoryKey}_${index}`;

            // Initialize state for item if not exists (from localstorage)
            let currentItem = singleItemsCart.find(i => i.key === itemKey);
            if (!currentItem) {
                currentItem = {
                    key: itemKey,
                    category: categoryKey,
                    optionName: optionName,
                    price: productData.price,
                    quantity: 0
                };
                singleItemsCart.push(currentItem);
            }

            // Create UI
            const card = document.createElement('div');
            card.className = 'product-item';
            card.innerHTML = `
                <div class="product-info">
                    <h3 class="product-title-with-hover">
                        ${optionName}
                        <span class="info-icon">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        </span>
                    </h3>
                    <div class="product-price">${productData.price} NTD</div>
                </div>
                <div class="qty-control">
                    <button class="qty-btn" onclick="updateSingleItemQty('${itemKey}', -1)">-</button>
                    <input type="text" class="qty-input" id="qty_${itemKey}" value="${currentItem.quantity}" readonly>
                    <button class="qty-btn" onclick="updateSingleItemQty('${itemKey}', 1)">+</button>
                </div>
            `;
            card.querySelector('.info-icon').addEventListener('click', (e) => {
                e.stopPropagation();
                showProductDetail(optionName, optionDesc, optionName);
            });

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
    const addGiftBoxBtn = document.getElementById('add-gift-box-btn');
    if (addGiftBoxBtn) {
        addGiftBoxBtn.addEventListener('click', () => {
            const select = document.getElementById('gift-box-type-select');
            if (select) {
                const boxTypeId = select.value;
                if (!boxTypeId) {
                    alert('請先選擇一種禮盒類型！');
                    return;
                }
                addGiftBox(boxTypeId);
                select.value = '';
            }
        });
    }

    // Submit Order (Alternative to onclick if needed, but let's just make it robust)
    const submitBtn = document.getElementById('submit-order-btn');
    if (submitBtn) {
        // We already have onclick in HTML, but adding here as well is fine 
        // as long as we don't double submit. Actually, let's just remove the 
        // faulty generate-order-btn listener.
    }
}

function addGiftBox(boxTypeId) {
    const boxDef = GIFT_BOXES[boxTypeId];
    const uniqueId = 'gb_' + Date.now() + Math.floor(Math.random() * 1000);

    // Initialize default selections (index 0 of each required list)
    let initialSelections = boxDef.selections.map(sel => 0);

    // Add to the beginning of the array so new boxes appear at the top
    giftBoxesCart.unshift({
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
            optionsList.forEach((opt, optIdx) => {
                const optName = opt.name;
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
                    <span class="gift-box-title product-title-with-hover" style="display:inline-flex;">
                        組合 ${index + 1}: ${box.name}
                        <span class="info-icon" style="margin-left: 5px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        </span>
                    </span>
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
        boxEl.querySelector('.info-icon').addEventListener('click', (e) => {
            e.stopPropagation();
            showProductDetail(box.name, boxDef.desc, boxDef.imageName);
        });

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
        if (document.getElementById('float-shipping-row')) {
            document.getElementById('float-shipping-row').innerHTML = `<span>運費:</span><span id="float-shipping-fee" style="color: #2e7d32; font-weight: 600;">0 NTD</span>`;
        }
    }

    const total = subtotal + shippingFee;

    document.getElementById('subtotal-price').innerText = `${subtotal} NTD`;
    document.getElementById('total-price').innerText = `${total} NTD`;

    // Save state
    saveCart();

    // Update Floating Cart
    if (document.getElementById('float-subtotal')) {
        document.getElementById('float-subtotal').innerText = `${subtotal} NTD`;

        if (subtotal > 0 && subtotal < 1000) {
            document.getElementById('float-shipping-row').innerHTML = `<span>運費:</span><span id="float-shipping-fee">65 NTD</span>`;
            document.getElementById('float-shipping-row').style.display = 'flex';
        } else if (subtotal === 0) {
            document.getElementById('float-shipping-row').style.display = 'none';
        }

        document.getElementById('float-total-price').innerText = `${total} NTD`;

        // Update Itemized List
        const listContainer = document.getElementById('float-item-list');
        listContainer.innerHTML = '';

        let totalItems = 0;

        // Add single items to float cart list
        singleItemsCart.filter(i => i.quantity > 0).forEach(item => {
            totalItems += item.quantity;
            const li = document.createElement('li');
            li.innerHTML = `<span class="item-name">${item.optionName}</span><span class="item-qty-price">x${item.quantity}</span>`;
            listContainer.appendChild(li);
        });

        // Add gift boxes to float cart list
        giftBoxesCart.forEach(box => {
            totalItems += box.quantity;
            const boxDef = GIFT_BOXES[box.typeId];

            // 擷取選擇的明細組成提示文字
            const selDetails = boxDef.selections.map((selItem, sIndex) => {
                const optIdx = box.selections[sIndex];
                const optName = PRODUCTS[selItem.type].options[optIdx].name;
                return `${optName.split(' ')[1] || optName}`;
            }).join(' + ');

            const li = document.createElement('li');
            const displayName = box.name.replace(':', '') + '組合';
            li.innerHTML = `
                <div class="item-name" style="display:flex; flex-direction:column; padding-right:10px;">
                    <span style="font-weight:600; color:var(--primary-color);">${displayName}</span>
                    <span style="font-size:0.75rem; color:var(--text-muted); margin-top:2px; line-height:1.3;">(${selDetails})</span>
                </div>
                <span class="item-qty-price">x${box.quantity}</span>
            `;
            listContainer.appendChild(li);
        });

        const badge = document.getElementById('floating-badge');
        badge.innerText = totalItems;

        // Hide badge if empty
        if (totalItems === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'flex';
        }
    }
}

// Floating Cart Logic
function toggleFloatingCart() {
    const cart = document.getElementById('floating-cart');
    cart.classList.toggle('collapsed');
}

function scrollToCheckout() {
    toggleFloatingCart(); // Close the floating cart
    const checkoutSection = document.querySelector('.cart-section');
    checkoutSection.scrollIntoView({ behavior: 'smooth' });
}

function submitOrder() {
    if (isSubmitting) return;
    console.log("Submit order button clicked");
    isSubmitting = true;
    try {
        // 1. Collect Client Info safely
        const clubEl = document.getElementById('entry_club');
        const titleEl = document.getElementById('entry_title');
        const nameCNEl = document.getElementById('entry_name_cn');
        const nameENEl = document.getElementById('entry_name_en');
        const phoneEl = document.getElementById('entry_phone');
        const addressEl = document.getElementById('entry_address');
        const deliveryModeEl = document.querySelector('input[name="entry_delivery_mode"]:checked');
        const pickupTimeEl = document.getElementById('entry_pickup_time');

        // Defensive check
        if (!clubEl || !titleEl || !nameCNEl || !phoneEl || !addressEl || !deliveryModeEl) {
            console.error("Required DOM elements not found");
            alert("⚠️ 系統偵測到頁面元件載入不完全，格式可能已跑掉，請重新整理網頁後再試一次。");
            isSubmitting = false;
            return;
        }

        const club = clubEl.value.trim();
        const title = titleEl.value.trim();
        const nameCN = nameCNEl.value.trim();
        const nameEN = nameENEl ? nameENEl.value.trim() : "";
        const email = document.getElementById('entry_email').value.trim();
        const phone = phoneEl.value.trim();
        const address = addressEl.value.trim();
        const deliveryMode = deliveryModeEl.value;
        const pickupTime = (deliveryMode === "預購，現場取貨" && pickupTimeEl) ? pickupTimeEl.value : "宅配到府 (非活動當天取貨)";

        // 2. Collect Payment Details
        const isTransfer = document.getElementById('payment-transfer-box').classList.contains('active');
        const paymentInfo = isTransfer
            ? document.getElementById('transfer_last_five').value.trim()
            : document.getElementById('linepay_status').value.trim();

        // 3. Validation
        let missingFields = [];
        if (!club) missingFields.push("1. 來自哪個扶青/扶輪社？");
        if (!title) missingFields.push("2. 社內職稱");
        if (!nameCN) missingFields.push("3. 中文姓名");
        if (!email) missingFields.push("電子郵件 (Email)");
        if (!phone) missingFields.push("5. 電話");
        if (!address) missingFields.push("6. 收貨地址");
        if (!paymentInfo) missingFields.push("付款帳號後五碼 或 付款狀態確認");

        if (email && !email.includes('@')) {
            alert("⚠️ 電子郵件格式不正確，請重新確認。");
            return;
        }

        if (missingFields.length > 0) {
            alert("⚠️ 訂單尚未完成！請填寫以下必填欄位：\n\n" + missingFields.join('\n'));
            return;
        }

        // 4. Collect Cart Details
        let subtotal = 0;
        const orderLines = [];
        orderLines.push("=== 扶青慈善義賣 購物明細 ===");

        singleItemsCart.filter(item => item.quantity > 0).forEach(item => {
            const lineTotal = item.price * item.quantity;
            subtotal += lineTotal;
            orderLines.push(`[單品] ${item.optionName} x ${item.quantity} (小計: ${lineTotal})`);
        });

        giftBoxesCart.forEach((box) => {
            const lineTotal = box.price * box.quantity;
            subtotal += lineTotal;
            const boxDef = GIFT_BOXES[box.typeId];
            const selDetails = boxDef.selections.map((selItem, sIndex) => {
                const optIdx = box.selections[sIndex];
                const optName = PRODUCTS[selItem.type].options[optIdx].name;
                return `${selItem.label}: ${optName.split(' ')[1] || optName}`;
            }).join('、');
            orderLines.push(`[${box.name.split(':')[0]}] (${selDetails}) x ${box.quantity} (小計: ${lineTotal})`);
        });

        if (subtotal === 0) {
            alert("您的購物車是空的，請先選擇商品再結帳！");
            isSubmitting = false;
            return;
        }

        const shipping = subtotal < 1000 ? 65 : 0;
        const total = subtotal + shipping;
        orderLines.push("\n===========================");
        orderLines.push(`商品總額: ${subtotal} NTD`);
        orderLines.push(`運費: ${shipping} NTD`);
        orderLines.push(`總計應付: ${total} NTD`);
        orderLines.push("===========================");

        const orderDetailText = orderLines.join('\n');

        // 5. Submit to Google Form (Background)
        const formAction = "https://docs.google.com/forms/d/e/1FAIpQLScjJODuzwSRnEz2pYDB-RmnGjvpS3rRmlNY8cLVlQNhEv9bMw/formResponse";

        const formData = new URLSearchParams();
        formData.append(FORM_ENTRY_ID, orderDetailText);
        formData.append(FORM_ENTRY_ID_2, orderDetailText);
        formData.append(ENTRY_CLUB, club);
        formData.append(ENTRY_TITLE, title);
        formData.append(ENTRY_NAME_CN, nameCN);
        formData.append(ENTRY_NAME_EN, nameEN);
        formData.append(ENTRY_PHONE, phone);
        formData.append(ENTRY_ADDRESS, address);
        formData.append(ENTRY_EMAIL, email);
        formData.append(ENTRY_DELIVERY_MODE, deliveryMode);
        formData.append(ENTRY_PICKUP_TIME, pickupTime);
        formData.append(ENTRY_PAYMENT_INFO, paymentInfo);

        // DEBUG: Log all data being sent
        console.log("--- SUBMISSION DATA START ---");
        for (let entry of formData.entries()) {
            console.log(`${entry[0]}: ${entry[1]}`);
        }
        console.log("--- SUBMISSION DATA END ---");

        // Provide immediate feedback
        const submitBtn = document.getElementById('submit-order-btn');
        if (!submitBtn) return;
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "⏳ 提交中...請稍候";
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.7";

        console.log("Sending request to Google Forms...");
        fetch(formAction, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        }).then(() => {
            console.log("Submission successful");
            alert("✅ 訂單已成功送出！感謝您的預購。\n我們將會盡快處理您的訂單。");
            showToast("🚀 訂單已成功送出！");

            setTimeout(() => {
                localStorage.removeItem('shoppingCartSingleItems');
                localStorage.removeItem('shoppingCartGiftBoxes');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => location.reload(), 500);
            }, 1000);
        }).catch(err => {
            console.error("Submission error:", err);
            isSubmitting = false;
            alert("❌ 提交時發生錯誤，請截圖您的購物明細並聯繫主辦單位。");
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
        });
    } catch (error) {
        console.error("Critical error in submitOrder:", error);
        isSubmitting = false;
        alert("⚠️ 提交訂單時發生程式錯誤：\n" + error.message + "\n請截圖告知我們，謝謝！");
    }
}
window.submitOrder = submitOrder;

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
