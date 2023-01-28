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
    static apps = '/apps';
    static clientsValidation = `/validation`;
    static clients_update_password = '/clients/update_password';
    static clients_recover_password = '/clients/recover_password';
    static clients_forgot_password = '/clients_forgot_password';
    static events = '/events';
    static queue = '/queue';
}

export default Endpoints;