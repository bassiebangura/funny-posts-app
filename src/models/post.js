export default class Order {
	constructor(order = {}, buyer = {}) {
		this._id = order._id;
		this.lotType = order["order/lotType"];
		this.buyer = buyer;
		this.dateOrdered = order["order/dateOrdered"];
		this.productRef = new Product(order.productRef);
		this.quantity = order["order/quantity"];
	}
}
