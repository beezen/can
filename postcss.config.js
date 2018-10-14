module.exports = {
    plugins: [
        require('autoprefixer')({
            browsers:[
                "> 0.01%"
            ]
        }),
        require("precss")
    ]
};