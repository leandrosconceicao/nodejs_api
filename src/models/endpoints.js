class Endpoints {

    static home = '/';
    static products = '/products';
    static product_images = `${this.products}/images`;
    static menu_items = `${this.products}/menu_items`;
    static categories = '/categories';
    static authentication = '/authentication';
    static establishments = '/establishments';
    static users = '/users';
    static clients = '/clients';
}

export default Endpoints;