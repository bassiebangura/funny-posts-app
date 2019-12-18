export default class Product {
	constructor(product = {}) {
		this._id = product._id;
		this.name = product["product/name"];
		this.description = product["product/description"];
		this.partType = product["product/partType"];
		this.controlLevel = product["product/controlLevel"];
		this.minPrice = product["product/minPrice"];
		this.maxPrice = product["product/maxPrice"];
		this.productType = product["product/productType"];
		this.imageURI =
			product["product/imageURI"] ||
			"http://www.zeanoelec.com/upload/images/Alliance-Memory/Integrated%20Circuits%20-%20ICs/Memory/Alliance_FBGA_96_t.jpg";
		if (product["product/subComponents"]) {
			this.subComponents = product["product/subComponents"].map(
				product => new Product(product)
			);
		}
	}
}
