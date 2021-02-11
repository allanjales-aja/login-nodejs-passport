const bcrypt = require('bcryptjs');   //encriptografador
const LocalStrategy = require('passport-local').Strategy;   //Campos do login para autenticação
 
const users = [{
    _id: 1,
    username: "adm",
    password: "$2a$06$HT.EmXYUUhNo3UQMl9APmeC0SwoGsx7FtMoAWdzGicZJ4wR1J8alW",   //hash da senha “123”
    email: "contato@luiztools.com.br"
}];
 
module.exports = function(passport){
    function findUser(username){
        return users.find(user => user.username === username);      //SELECT OU URM
    }
    
    function findUserById(id){
        return users.find(user => user._id === id);      //SELECT OU URM
    }

    passport.serializeUser((user, done) => {      //PASSPORT SALVA COOK NO FRONTEND (NAVEGADOR DO USUÁRIO) E SESSÃO NO BACKEND
        done(null, user._id);      //"null" é a informação de erro e "user._id" é a informação que será salva (campo único), email 
    });
 
    passport.deserializeUser((id, done) => {       //LÊ O COOK E TRANSFORMA NO OBJETO NOVAMENTE, QUE VEIO NA REQUEST
        try {
            const user = findUserById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',     //'username' do form
        passwordField: 'password'       //'password' do form
    },
        (username, password, done) => {
            try {
                const user = findUser(username);
     
                // usuário inexistente
                if (!user) { return done(null, false) }
     
                // comparando as senhas
                const isValid = bcrypt.compareSync(password, user.password);
                if (!isValid) return done(null, false)
                
                return done(null, user)
            } catch (err) {
                done(err, false);
            }
        }
    ));
}
