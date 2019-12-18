export default class Operator {
	constructor(data = {}) {
		this.id = data["_id"];
		this.name = data["operator/name"];
		this.products = data["operator/products"];
	}
}
