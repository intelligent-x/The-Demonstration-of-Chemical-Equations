// 实例化对象
const calculator = new Calculator();
const transporter = new Transporter();
const renderer = new Renderer();
const configer = new Configer( 
    [
        document.querySelector('#materialNumber'), 
        document.querySelector('#productNumber')
    ],
    [
        document.querySelector('.material-config'),
        document.querySelector('.product-config')
    ]
);
const controler = new Controler({ calculator, transporter, renderer, configer });
