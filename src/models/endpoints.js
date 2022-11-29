class Endpoints {

    static home = '/';
    static products = '/products';
    static product_images = `${this.products}/images`;
    static menu_items = `${this.products}/menu_items`;
    static add_ones = `${this.products}/add_ones`;
    static categories = '/categories';
    static orders = '/orders';
    static authentication = '/authentication';
    static establishments = '/establishments';
    static users = '/users';
    static clients = '/clients';
    static events = '/events';
}

export default Endpoints;