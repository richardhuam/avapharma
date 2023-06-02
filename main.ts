/* Product: Los productos poseen ID (único e irrepetible), nombre y precio */
interface Product {
  id: string;
  name: string;
  price: number;
}

interface Inventory {
  productId: string;
  assignedQuantity: number;
  reservedQuantity: number;
}

interface Client {
  name: string;
  lastName: string;
  dni: string;
}

interface Basket {
  products: Product[];
  bodega?: string;
}

interface Order {
  client: Client[];
  products: Product[];
  bodegas: string[];
}

class AvapharmaSystem {
  clients: Client[] = [];
  products: Product[] = [];
  inventories: Inventory[] = [];
  basket: Basket[] = [];

  registerClient(name: string, lastName: string, dni: string): void {
    const existingClient = this.clients.filter((client) => client.dni === dni);

    // check if user exists
    if (existingClient.length > 0) {
      console.log("Error: Client with the same DNI already exists.");
      return;
    }

    const newClient: Client = { name, lastName, dni };

    const arrDNI = dni.trim().split("");

    // check is dni is 8 characters long
    if (arrDNI.length !== 8) {
      console.log("DNI have to be 8 character long");
      return;
    }

    // check is dni only contain numbers
    for (let i = 0; i < arrDNI.length; i++) {
      if (isNaN(parseInt(arrDNI[i]))) {
        console.log("DNI must only contain numeric values");
        return;
      }
    }
    // register client
    this.clients.push(newClient);
    console.log("Client registered successfully!");
  }

  createBasket(productIds: string[], bodega: string = "Bodega-1") {
    const products: Product[] = [];

    for (const productId of productIds) {
      const product = this.products.filter((p) => p.id === productId);

      if (product.length > 0) {
        const inventory = this.inventories.filter(
          (inv) => inv.productId === productId
        );
        if (inventory.length > 0 && inventory[0].assignedQuantity > 0) {
          products.push(product[0]);
          inventory[0].reservedQuantity++;
        } else {
          console.log(
            `Oops: The product with Id ${productId} is out of stock.`
          );
        }
      } else {
        console.log(`Oops: The product with Id ${productId} does not exist.`);
      }
    }

    if (products.length > 0) {
      const newBasket: Basket = { products, bodega };
      this.basket.push(newBasket);
      console.log("Basket created successfully!");
    }
  }

  // complete order
  completeOrder(clientDNI: string): void {
    const client = this.clients.filter((c) => c.dni === clientDNI);
    if (client.length < 1) {
      console.log("Oh no: Client not found");
      return;
    }

    let basketIndex: number = -1;

    for (let i = 0; i < this.basket.length; i++) {
      const basket = this.basket[i];
      let allProductsAvailable = true;

      for (const product of basket.products) {
        let productAvailable = false;

        for (const inventory of this.inventories) {
          if (
            inventory.productId === product.id &&
            inventory.assignedQuantity > 0
          ) {
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

    const basket = this.basket[basketIndex];
    const products = basket.products;

    const bodegas: string[] = [];
    for (const product of products) {
      const inventory = this.inventories.filter(
        (inv) => inv.productId === product.id
      );
      if (inventory.length > 0) {
        inventory[0].assignedQuantity--;
        bodegas.push(`${basket.bodega}`);
      }
    }

    const newOrder: Order = { client, products, bodegas };
    this.basket.splice(basketIndex, 1);

    console.log("Order successfully!");
    console.log("Order details:");
    console.log(newOrder);
  }
}

const system = new AvapharmaSystem();

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
