export default class Person {
	constructor(data = {}) {
		this.id = data["_id"];
		this.name = data["operator/name"];
		this.products = data["operator/products"];
	}
}
