var AvapharmaSystem = /** @class */ (function () {
    function AvapharmaSystem() {
        this.clients = [];
        this.products = [];
        this.inventories = [];
        this.basket = [];
    }
    AvapharmaSystem.prototype.registerClient = function (name, lastName, dni) {
        var existingClient = this.clients.filter(function (client) { return client.dni === dni; });
        // check if user exists
        if (existingClient.length > 0) {
            console.log("Error: Client with the same DNI already exists.");
            return;
        }
        var newClient = { name: name, lastName: lastName, dni: dni };
        var arrDNI = dni.trim().split("");
        // check is dni is 8 characters long
        if (arrDNI.length !== 8) {
            console.log("DNI have to be 8 character long");
            return;
        }
        // check is dni only contain numbers
        for (var i = 0; i < arrDNI.length; i++) {
            if (isNaN(parseInt(arrDNI[i]))) {
                console.log("DNI must only contain numeric values");
                return;
            }
        }
        // register client
        this.clients.push(newClient);
        console.log("Client registered successfully!");
    };
    AvapharmaSystem.prototype.createBasket = function (productIds, bodega) {
        if (bodega === void 0) { bodega = "Bodega-1"; }
        var products = [];
        var _loop_1 = function (productId) {
            var product = this_1.products.filter(function (p) { return p.id === productId; });
            if (product.length > 0) {
                var inventory = this_1.inventories.filter(function (inv) { return inv.productId === productId; });
                if (inventory.length > 0 && inventory[0].assignedQuantity > 0) {
                    products.push(product[0]);
                    inventory[0].reservedQuantity++;
                }
                else {
                    console.log("Oops: The product with Id ".concat(productId, " is out of stock."));
                }
            }
            else {
                console.log("Oops: The product with Id ".concat(productId, " does not exist."));
            }
        };
        var this_1 = this;
        for (var _i = 0, productIds_1 = productIds; _i < productIds_1.length; _i++) {
            var productId = productIds_1[_i];
            _loop_1(productId);
        }
        if (products.length > 0) {
            var newBasket = { products: products, bodega: bodega };
            this.basket.push(newBasket);
            console.log("Basket created successfully!");
        }
    };
    // complete order
    AvapharmaSystem.prototype.completeOrder = function (clientDNI) {
        var client = this.clients.filter(function (c) { return c.dni === clientDNI; });
        if (client.length < 1) {
            console.log("Oh no: Client not found");
            return;
        }
        var basketIndex = -1;
        for (var i = 0; i < this.basket.length; i++) {
            var basket_1 = this.basket[i];
            var allProductsAvailable = true;
            for (var _i = 0, _a = basket_1.products; _i < _a.length; _i++) {
                var product = _a[_i];
                var productAvailable = false;
                for (var _b = 0, _c = this.inventories; _b < _c.length; _b++) {
                    var inventory = _c[_b];
                    if (inventory.productId === product.id &&
                        inventory.assignedQuantity > 0) {
                        productAvailable = true;
                        break;
                    }
                }
                if (!productAvailable) {
                    allProductsAvailable = false;
                    break;
                }
            }
            if (allProductsAvailable) {
                basketIndex = i;
                break;
            }
        }
        if (basketIndex === -1) {
            console.log("Error: No valid basket found for completion.");
            return;
        }
        var basket = this.basket[basketIndex];
        var products = basket.products;
        var bodegas = [];
        var _loop_2 = function (product) {
            var inventory = this_2.inventories.filter(function (inv) { return inv.productId === product.id; });
            if (inventory.length > 0) {
                inventory[0].assignedQuantity--;
                bodegas.push("".concat(basket.bodega));
            }
        };
        var this_2 = this;
        for (var _d = 0, products_1 = products; _d < products_1.length; _d++) {
            var product = products_1[_d];
            _loop_2(product);
        }
        var newOrder = { client: client, products: products, bodegas: bodegas };
        this.basket.splice(basketIndex, 1);
        console.log("Order successfully!");
        console.log("Order details:");
        console.log(newOrder);
    };
    return AvapharmaSystem;
}());
var system = new AvapharmaSystem();
// adding new users
system.registerClient("Rachael", "Stanley", "12345678");
system.products.push({ id: "1", name: "Product1", price: 10 });
system.products.push({ id: "2", name: "Product2", price: 20 });
system.products.push({ id: "3", name: "Product3", price: 30 });
system.inventories.push({
    productId: "1",
    assignedQuantity: 5,
    reservedQuantity: 0,
});
system.inventories.push({
    productId: "2",
    assignedQuantity: 3,
    reservedQuantity: 0,
});
system.inventories.push({
    productId: "3",
    assignedQuantity: 1,
    reservedQuantity: 0,
});
system.createBasket(["1", "2", "3"]);
system.createBasket(["3"]);
system.completeOrder("12345678");
system.completeOrder("87654321");
