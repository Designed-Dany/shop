let parentCheckbox = document.querySelector('.main-checkbox') // главный чекбокс продуктов
let childCheckboxs = document.querySelectorAll('.checkbox-child') // дочерние чекбосы продуктов
let basketResult = document.querySelector('.basket__result'); // результат корзины
let arrowCartProduct = document.querySelector('.cart-svg__margin'); // кнопка которая скрывает и отображает продукты
let arrowCartMissing = document.querySelector('.arrowCartMissing');

let products = document.querySelector('.products__gap'); // блок с продуктами

	let productItem = {
		'sdl532' : {'count' : 1, 'subtotalprice' : 522, 'originalPrice': 522, 'oldPrice': 1051}, 
		'fkdr32' : {'count' : 200, 'subtotalprice' : 2100047, 'originalPrice': 10500.235, 'oldPrice': 2300047}, 
		"flsdf21" : {'count' : 2, 'subtotalprice' :	494, 'originalPrice': 247, 'oldPrice': 950}
}; // объект со всеми продуктами и их ценами

let checkboxText = document.querySelector('.checkbox__text');
let checkboxCart = document.getElementById('checkbox');
let productMissing = document.querySelector('.product__hidden');
let countBasket = document.querySelector('.count-basket p')
let productNavigation = document.querySelectorAll('.product__navigation')

const totalPriceWrapper = document.getElementById('total-price') // итоговое число

const quantiyProducts = document.getElementById('quantity-products'); // место в которое нужно вставить количество всех продуктов

const sumOldProducts = document.getElementById('sum-Old_Products') // сумма всех продуктов по старой цене

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); // регулярка которая делит числа на разряды для удобства и читаемости больших сумм
}

const ACTION = {
	PLUS: 'plus',
	MINUS: 'minus'
}

const getItemSubTotalPrice = (inputs) => Number(inputs.value) * Number(inputs.dataset.price) // сокращенная версия 

const getItemOldTotalPrice = (inputs) => Number(inputs.value) * Number(inputs.dataset.oldprice)


// выводит основное итоговое число со всеми правками в соответстующее поле 
const setTotalPrice = (value) => { 
	totalPriceWrapper.textContent = numberWithSpaces(value);
	// вывод итогового числа всех товаров с применением регулярки
	totalPriceWrapper.dataset.value = value;
	// вместо того чтобы отформатировать в итоге к числу строку, мы просто сделали это более коротким способом
}
 
const setOldTotalPrice = (value) => {
	sumOldProducts.textContent = numberWithSpaces(value);
	sumOldProducts.dataset.value = value;
}

const init = () => {
	let totalCost = 0; // начальное значение итоговой суммы
	let oldTotalCost = 0; // начальное значение итоговой суммы по старым ценникам
	let productItems = document.querySelectorAll('.product__item_active'); // все карточки товаров
	
	

	productItems.forEach((basketItem) => {
		totalCost += getItemSubTotalPrice(basketItem.querySelector('.inputs'))
		oldTotalCost += getItemOldTotalPrice(basketItem.querySelector('.inputs'))
		// проходимся циклом по всему массиву из трех товаров, преобразуем их в число после обращаемся к инпутам, а именно в value, позже умножаем также на значение инпутов только дата атрибута price, в котором указана его цена\
		
	})
			
		setTotalPrice(totalCost);
		setOldTotalPrice(oldTotalCost);
}


const calculateSeparateItem = (basketItem, action) => {
	const input = basketItem.querySelector('.inputs') // нашли инпут в котором все значения мы вычисляем
	
	switch (action) {
		case ACTION.PLUS: // обращаемся к объекту действие: плюс
			input.value++; // увеливаем значение value на один

			setTotalPrice(Math.trunc(Number(totalPriceWrapper.dataset.value)) + Math.trunc(Number(input.dataset.price)))
			// quantiyProducts.textContent = 
			setOldTotalPrice(Math.trunc((Number(sumOldProducts.dataset.value))) + Math.trunc(Number(input.dataset.oldprice)))

			break; // заканчиваем проверку

		case ACTION.MINUS: // обращаемся к объекту действие: минус
			input.value--; // уменьшаем значение value на один

			setTotalPrice(Math.trunc(Number(totalPriceWrapper.dataset.value)) - Math.trunc(Number(input.dataset.price)))

			setOldTotalPrice(Math.trunc(Number(sumOldProducts.dataset.value)) - Math.trunc(Number(input.dataset.oldprice)))
			break; // заканчиваем проверку
	}

	basketItem.querySelector('.subtotal').textContent = `${numberWithSpaces(getItemSubTotalPrice(input))} сом` // вывод подытога обычной цены

	basketItem.querySelector('.subtotal-old').textContent = `${numberWithSpaces(getItemOldTotalPrice(input))} сом` // вывод подытога старой цены
}

products.addEventListener('click', (event) => {
	const target = event.target

	if (target.classList.contains('plus')) {
	 calculateSeparateItem(
		target.closest('.product__item_active'), 
		ACTION.PLUS
	)
	 // ищет родителя
	}
	if (target.classList.contains('minus')) {
		calculateSeparateItem(
			target.closest('.product__item_active'), 
			ACTION.MINUS
		)
	}
})

init();

// проверяет если убрал дочерний чекбокс то активность главного меняется на false
function checkCheckbox() {
	for (let i = 0; i < childCheckboxs.length; i++) {
		childCheckboxs[i].addEventListener('click', () => {
			if (childCheckboxs[i].checked == false) {
				parentCheckbox.checked = false;
			} 
		})
	}
}

checkCheckbox()

 // прячет текст выбрать все и отображает кол-во и сумму продуктов
function hiddenCartText() {
	checkboxText.textContent = Object.keys(productItem).length + ' товара  · ' + totalPriceWrapper.textContent
	checkboxCart.classList.add('none')
}

// показывает изначальное состояние поля выбрать все
function showCartText() {
	checkboxText.textContent = 'Выбрать все'
	checkboxCart.classList.remove('none')
}

// прячет карточку с товарами и опускает стрелку вниз
function hiddenProducts() {
	arrowCartProduct.classList.add('transform-arrow')
	products.classList.add('none')
}

// возвращает карточку с товарами в обычное состояние и стрелку
function showProducts() {
	arrowCartProduct.classList.remove('transform-arrow')
	products.classList.remove('none')
}

// прячет карточку с отсутствующими товарами и опускает стрелку вниз
function hiddenMissingProducts() {
	arrowCartMissing.classList.add('transform-arrow')
	productMissing.classList.add('none')
}

// возвращает карточку с отсутствующими товарами в обычное состояние и стрелку
function showMissingProducts() {
	arrowCartMissing.classList.remove('transform-arrow')
	productMissing.classList.remove('none')
}

// выбирает все чекбоксы по одному главному чекбоксу и также убирает при повторном клике
function selectCheckBox() {
	for (let i = 0; i < childCheckboxs.length; i++) {
		if (parentCheckbox.checked == true) {
			childCheckboxs[i].checked = true;
		} else {
			childCheckboxs[i].checked = false;
		}
	} 
}

parentCheckbox.addEventListener('click', () => {
	selectCheckBox()
})

arrowCartProduct.addEventListener('click', () => {
	for (let i = 0; i < Object.keys(productItem).length; i++) {
		
	if (!arrowCartProduct.classList.contains('transform-arrow')) {
		hiddenProducts()
		hiddenCartText()
	} else  {
		showProducts()
		showCartText()
	}
}
})

arrowCartMissing.addEventListener('click', () => {
	if (!arrowCartMissing.classList.contains('transform-arrow')) {
		hiddenMissingProducts();
	} else {
		showMissingProducts();
	}
})


// когда мы нажимаем на минус или плюс элемента, мы должны подняться до родителя и внутри него уже искать количество, цену, подсумму и тд.

