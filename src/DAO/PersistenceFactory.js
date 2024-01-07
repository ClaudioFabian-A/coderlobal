import config from "../config/config.js";

export default class PersistenceFactory {
    static getPersistence = async() => {

        let UsersDao;
        let CartsDao;
        let ProductsDao;
        let TicketsDao;
        let ChatDao;

        switch (config.app.PERSISTENCE) {
            case "MEMORY":
                {
                    UsersDao = (await
                        import ("./memory/usersDao.js")).default;
                    CartsDao = (await
                        import ("./memory/cartsDao.js")).default;
                    ProductsDao = (await
                        import ("./memory/productsDao.js")).default;
                    TicketsDao = (await
                        import ("./memory/ticketsDao.js")).default;
                    ChatDao = (await
                        import ("./memory/chatDao.js")).default;
                    break;
                }
            case "FS":
                {
                    UsersDao = (await
                        import ("./fileSystem/usersDao.js")).default;
                    CartsDao = (await
                        import ("./fileSystem/cartsDao.js")).default;
                    ProductsDao = (await
                        import ("./fileSystem/productsDao.js")).default;
                    TicketsDao = (await
                        import ("./fileSystem/ticketsDao.js")).default;
                    ChatDao = (await
                        import ("./fileSystem/chatDao.js")).default;
                    break;
                }
            case "MONGO":
                {
                    UsersDao = (await
                        import ("./mongo/usersDao.js")).default;
                    CartsDao = (await
                        import ("./mongo/cartsDao.js")).default;
                    ProductsDao = (await
                        import ("./mongo/productsDao.js")).default;
                    TicketsDao = (await
                        import ("./mongo/ticketsDao.js")).default;
                    ChatDao = (await
                        import ("./mongo/chatDao.js")).default;
                    break;
                }
        }
        return {
            UsersDao,
            CartsDao,
            ProductsDao,
            TicketsDao,
            ChatDao,
        };
    };
}