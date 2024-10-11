let parentCheckbox = document.querySelector('.main-checkbox') // главный чекбокс продуктов
let childCheckboxs = document.querySelectorAll('.checkbox-child') // дочерние чекбосы продуктов
let basketResult = document.querySelector('.basket__result'); // результат корзины
let arrowCartProduct = document.querySelector('.cart-svg__margin'); // кнопка которая скрывает и отображает продукты
let arrowCartMissing = document.querySelector('.arrowCartMissing');

let products = document.querySelector('.products__gap'); // блок с продуктами

let checkboxText = document.querySelector('.checkbox__text');
let checkboxCart = document.getElementById('checkbox');
let productMissing = document.querySelector('.product__hidden');
let countBasket = document.querySelector('.count-basket p')
let productNavigation = document.querySelectorAll('.product__navigation')

const totalPriceWrapper = document.getElementById('total-price') // итоговое число
const quantiyProducts = document.getElementById('quantity-products'); // место в которое нужно вставить количество всех продуктов
const sumOldProducts = document.getElementById('sum-Old_Products') // сумма всех продуктов по старой цене
const sumDiscount = document.querySelector(".basket-counts__discount")
const allQuantityBasket = document.querySelector('.basket-counts__quantity');
let arrayCart = [...document.querySelectorAll('.product__item_active')]

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); // регулярка которая делит числа на разряды для удобства и читаемости больших сумм
}

const ACTION = {
	PLUS: 'plus',
	MINUS: 'minus'
}

const getItemSubTotalPrice = (inputs) =>  Number(inputs.value) * Number(inputs.dataset.price) // сокращенная версия 

const getItemOldTotalPrice = (inputs) => Number(inputs.value) * Number(inputs.dataset.oldprice)

const getItemQuantityTotal = (inputs) => Number(inputs.dataset.value)

// выводит основное итоговое число со всеми правками в соответстующее поле 
const setTotalPrice = (value) => { 
	totalPriceWrapper.textContent = numberWithSpaces(Math.round(value));
	// вывод итогового числа всех товаров с применением регулярки
	totalPriceWrapper.dataset.value = value;
	// вместо того чтобы отформатировать в итоге к числу строку, мы просто сделали это более коротким способом
}

const setOldTotalPrice = (value) => {
	sumOldProducts.textContent = numberWithSpaces(Math.round(value));
	sumOldProducts.dataset.value = value;
}

const setTotalQuantity = (value) => {
	allQuantityBasket.textContent = numberWithSpaces(Number(value));
	allQuantityBasket.dataset.value = Number(value);
}


// отображение текущего состояние всех полей и подсчета в корзине с текущими позициями, стартовая функция
const init = () => {

	// выбирает все чекбоксы по одному главному чекбоксу и также убирает при повторном клике, выводит изначальные данные корзины
	function selectCheckBox() {
		let totalCost = 0; // начальное значение итоговой суммы
		let oldTotalCost = 0; // начальное значение итоговой суммы по старым ценникам
		let quantityTotalCost = 0;
		let productItems = document.querySelectorAll('.product__item_active'); // все 	карточки товаров 

		productItems.forEach((basketItem) => {
		totalCost += getItemSubTotalPrice(basketItem.querySelector('.inputs'))
		oldTotalCost += getItemOldTotalPrice(basketItem.querySelector('.inputs'))
		quantityTotalCost += getItemQuantityTotal(basketItem.querySelector('.inputs'))
		// проходимся циклом по всему массиву из трех товаров, преобразуем их в число 	после обращаемся к инпутам, а именно в value, позже умножаем также на 	значение инпутов только дата атрибута price, в котором указана его цена\
		})
		
		setTotalPrice(totalCost); // ввывод обычной итовой цены
		setOldTotalPrice(oldTotalCost); // вывод старой итоговой цены
		setTotalQuantity(quantityTotalCost);
		sumDiscount.textContent = numberWithSpaces(totalCost - oldTotalCost) //вывод 	разницы между старой и новой ценой
		
		for (let i = 0; i < childCheckboxs.length; i++) {
			
			if (parentCheckbox.checked == true) {
				childCheckboxs[i].checked = true;
				
 				productItems.forEach((basketItem) => {
					totalCost += getItemSubTotalPrice(basketItem.querySelector('.inputs'))
					oldTotalCost += getItemOldTotalPrice(basketItem.querySelector('.inputs'))
					quantityTotalCost += getItemQuantityTotal(basketItem.querySelector('.inputs'))
					// проходимся циклом по всему массиву из трех товаров, преобразуем их в число 	после обращаемся к инпутам, а именно в value, позже умножаем также на 	значение инпутов только дата атрибута price, в котором указана его цена
					arrayCart = [...document.querySelectorAll('.product__item_active')] // изначально там лежат 3 товара
					countBasket.textContent = arrayCart.length;
					})
					document.querySelectorAll(".minus").forEach((minusItem) => {
						minusItem.disabled = false;
					})
					document.querySelectorAll(".plus").forEach((plusItem) => {
						plusItem.disabled = false;
					})
			} else {
					childCheckboxs[i].checked = false;
				 	totalCost = 0; // ввывод обычной итовой цены
				 	oldTotalCost = 0; // вывод старой итоговой цены
				 	quantityTotalCost = 0;
				 	sumDiscount.textContent = '-' + numberWithSpaces(totalCost - oldTotalCost)  //вывод разницы между старой и новой ценой
				 	sumOldProducts.textContent = 0;
				 	totalPriceWrapper.textContent = 0;
				 	countBasket.textContent = arrayCart.length - arrayCart.length;
				 	arrayCart = []; // при клике на главный чекбокс массив становится пустой.
				 	allQuantityBasket.textContent = 0;
					document.querySelectorAll(".minus").forEach((minusItem) => {
						minusItem.disabled = true;
					})
					document.querySelectorAll(".plus").forEach((plusItem) => {
						plusItem.disabled = true;
					})
			}
		} 
	}

	parentCheckbox.addEventListener('click', () => {
		selectCheckBox()
	})		
		
	// проверяет если убрал дочерний чекбокс то активность главного меняется на false, когда чекбокс false то, нужно высчитывать из корзины количество, сумму, старую сумму.
	function checkCheckbox() {
		
		for (let i = 0; i < childCheckboxs.length; i++) {

			childCheckboxs[i].addEventListener('click', (event) => {
				const targetCheckbox = event.target
			 
				let input = targetCheckbox.closest('.product__item_active').querySelector(".inputs")

				if (childCheckboxs[i].checked == false) {
					parentCheckbox.checked = false;
					// здесь веду работу над вычислением при нажатии чекбокса и снятии

					setTotalPrice(Number(totalPriceWrapper.dataset.value) - Number(input.dataset.price) * (input.value))

					setOldTotalPrice(Number(sumOldProducts.dataset.value) - Number(input.dataset.oldprice) * (input.value))

					sumDiscount.textContent = ' -' + numberWithSpaces((sumOldProducts.dataset.value - totalPriceWrapper.dataset.value))	
					
					arrayCart.length--; // уменьшаем длину массива с товарами
					countBasket.textContent = arrayCart.length;

					allQuantityBasket.textContent = allQuantityBasket.dataset.value -= input.value

					targetCheckbox.closest('.product__item_active').querySelector(".minus").disabled = true

					targetCheckbox.closest('.product__item_active').querySelector(".plus").disabled = true
					
				} else {
					
					setTotalPrice(Number(totalPriceWrapper.dataset.value) + Number(input.dataset.price) * (input.value))

					setOldTotalPrice(Number(sumOldProducts.dataset.value) + Number(input.dataset.oldprice) * (input.value))

					sumDiscount.textContent = ' -' + numberWithSpaces((sumOldProducts.dataset.value - totalPriceWrapper.dataset.value))

					arrayCart.length++; // увеличиваем длину массива с товарами
					countBasket.textContent = arrayCart.length;

					targetCheckbox.closest('.product__item_active').querySelector(".minus").disabled = false
					targetCheckbox.closest('.product__item_active').querySelector(".plus").disabled = false
				}
				 
			})
		}
	}

// 


selectCheckBox()
checkCheckbox()
}

// подсчет корзины по кнопке "+" и "-"
const calculateSeparateItem = (basketItem, action) => {
	const input = basketItem.querySelector('.inputs') // нашли инпут в котором все значения мы вычисляем
	
	let quantityTotalCost = 0;
	quantityTotalCost += getItemQuantityTotal(basketItem.querySelector('.inputs'))
	
	switch (action) {
		case ACTION.PLUS: // обращаемся к объекту действие: плюс
			input.value++; // увеливаем значение value на один
			allQuantityBasket.dataset.value++ // увеличиваем количество товаров на один
			setTotalPrice(Number(totalPriceWrapper.dataset.value) + Number(input.dataset.price))

			setOldTotalPrice(Number(sumOldProducts.dataset.value) + Number(input.dataset.oldprice))
			
			allQuantityBasket.textContent = Number(allQuantityBasket.dataset.value) // вывод итога в спан 
			
			sumDiscount.textContent = ' -' + numberWithSpaces((sumOldProducts.dataset.value - totalPriceWrapper.dataset.value))
			break; // заканчиваем проверку

		case ACTION.MINUS: // обращаемся к объекту действие: минус
			input.value--; // уменьшаем значение value на один
			allQuantityBasket.dataset.value-- // уменьшаем количество товаров на один
			setTotalPrice(Number(totalPriceWrapper.dataset.value) - Number(input.dataset.price))

			setOldTotalPrice(Number(sumOldProducts.dataset.value) - Number(input.dataset.oldprice))

			allQuantityBasket.textContent = Number(allQuantityBasket.dataset.value) // вывод итога в спан

			sumDiscount.textContent = ' -' + numberWithSpaces(sumOldProducts.dataset.value - totalPriceWrapper.dataset.value)
			
			break; // заканчиваем проверку
	}

	basketItem.querySelector('.subtotal').textContent = numberWithSpaces(Math.round(getItemSubTotalPrice(input))) + " сом" // вывод подытога обычной цены

	basketItem.querySelector('.subtotal-old').textContent = numberWithSpaces(Math.round(getItemOldTotalPrice(input))) + " сом" // вывод подытога старой цены
}

products.addEventListener('click', (event) => {
	const targetProduct = event.target
	const input = targetProduct.closest('.product__item_active').querySelector('.inputs')
	if (targetProduct.classList.contains('plus')) {
		calculateSeparateItem(
		targetProduct.closest('.product__item_active'), 
		ACTION.PLUS)
	 // ищет родителя
	}

	if (targetProduct.classList.contains('limited-quantity')) {
		console.log('hekkoi');
		
	}

	if (targetProduct.classList.contains('minus')) {
		
		if (Number(input.value) !== 0) {
			calculateSeparateItem(
				targetProduct.closest('.product__item_active'), 
				ACTION.MINUS
			)
		}
	}
})



 // прячет текст выбрать все и отображает кол-во и сумму продуктов
function hiddenCartText() {
	checkboxText.textContent = arrayCart.length + ' товара  · ' + totalPriceWrapper.textContent + ' сом'
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

// все функции с скрытием и отображаением продуктов по кнопке arrow1
arrowCartProduct.addEventListener('click', () => {
	for (let i = 0; i < [...document.querySelectorAll('.product__item_active')].length; i++) {

	if (!arrowCartProduct.classList.contains('transform-arrow')) {
		hiddenProducts()
		hiddenCartText()
	} else  {
		showProducts()
		showCartText()
	}
}
})
// все функции с скрытием и отображаением продуктов по кнопке arrow2
arrowCartMissing.addEventListener('click', () => {
	if (!arrowCartMissing.classList.contains('transform-arrow')) {
		hiddenMissingProducts();
	} else {
		showMissingProducts();
	}
})

// когда мы нажимаем на минус или плюс элемента, мы должны подняться до родителя и внутри него уже искать количество, цену, подсумму и тд.


init();