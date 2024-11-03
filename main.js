let parentCheckbox = document.querySelector('.main-checkbox') // главный чекбокс продуктов
let childCheckboxs = document.querySelectorAll('.checkbox-child') // дочерние чекбосы продуктов
let basketResult = document.querySelector('.basket__result'); // результат корзины
let arrowCartProduct = document.querySelector('.cart-svg__margin'); // кнопка которая скрывает и отображает продукты
let arrowCartMissing = document.querySelector('.arrowCartMissing');

let products = document.querySelector('.products__gap'); // блок с продуктами

let checkboxText = document.querySelector('.checkbox__text');
let checkboxCart = document.getElementById('checkbox');
let productMissing = document.querySelector('.product__hidden');
let countBasketNumber = document.querySelector('.count-basket p')

let countBasket = document.querySelector('.count-basket')
let productNavigation = document.querySelectorAll('.product__navigation')

const totalPriceWrapper = document.getElementById('total-price') // итоговое число
const quantiyProducts = document.getElementById('quantity-products'); // место в которое нужно вставить количество всех продуктов
const sumOldProducts = document.getElementById('sum-Old_Products') // сумма всех продуктов по старой цене
const sumDiscount = document.querySelector(".basket-counts__discount")
const allQuantityBasket = document.querySelector('.basket-counts__quantity');
let arrayCart = [...document.querySelectorAll('.product__item_active')]
let arrayHiddenCart = [...document.querySelectorAll('.product__item_hidden')];
const productsNavigation = document.querySelectorAll('.product__navigation')
const deliveryPayPoint = document.querySelector('.delivery__pay_pointBtn') // кнопка способа доставки курьером
const deliveryPayDeliveryMan = document.querySelector('.delivery__pay_deliveryman') // кнопка способа доставки в пункт выдачи
const pointContent = document.querySelector('.delivery__point_content') // контент с пунктом выдачи
const payContent = document.querySelector('.delivery__pay_content') // контент с курьером

const outputText = document.querySelector('.delivery_subtitle_fontSize')
const outputDeliveryText = document.querySelector('.delivery__text')
const outputBasket = document.querySelector('.basket_subtitle');
let checkboxRadio = document.querySelectorAll('.delivery__input')
const outputBasketCount = document.querySelector('.basket-counts_output')
const deliveryDelete = document.querySelectorAll('.delivery__delete')

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); // регулярка которая делит числа на разряды для удобства и читаемости больших сумм
}

const deleteProduct = () => {
	const deleteButton = document.querySelectorAll('.product__delete_button')
	const deleteButtonHidden = document.querySelectorAll('.product__delete_hidden')
	deleteButton.forEach((deleteItem) => {
		
		deleteItem.addEventListener('click', (event) => {
			const targetDeleteButton = event.target
			let input = targetDeleteButton.closest('.product__item_active').querySelector(".inputs")
			
			if(deleteButton) {
				targetDeleteButton.closest('.product__item_active').classList.add('none');

				setTotalPrice(Number(totalPriceWrapper.dataset.value) - Number(input.dataset.price) * (input.value))
				setOldTotalPrice(Number(sumOldProducts.dataset.value) - Number(input.dataset.oldprice) * (input.value))
				
				sumDiscount.textContent = numberWithSpaces((sumOldProducts.dataset.value - totalPriceWrapper.dataset.value))

				arrayCart.length--; // уменьшаем длину массива с товарами

				countBasketNumber.textContent = arrayCart.length;

				setTotalQuantity(Number(allQuantityBasket.dataset.value) - Number(input.value))

				parentCheckbox.disabled = true;
				parentCheckbox.checked = false;
			}
			if (arrayCart.length == 0) {
				countBasket.classList.add('none')
			} 
		})
	}
)
	deleteButtonHidden.forEach((deleteHiddenItem) => {

		deleteHiddenItem.addEventListener('click', (event) => {
			const targetDeleteHiddenButton = event.target;
			let deleteHiddenBtn = targetDeleteHiddenButton.closest('.products').querySelector('.product__delete_hidden') 
			
			if (deleteHiddenBtn) {
				targetDeleteHiddenButton.closest('.product__item_hidden').classList.add('none');
				arrayHiddenCart.length--
				document.querySelector('.checkbox__cart_text').textContent = 'Отсутствуют  · ' + arrayHiddenCart.length + " товара";

			} if (arrayHiddenCart.length == 1) {
				document.querySelector('.checkbox__cart_text').textContent = 'Отсутствует  · ' + arrayHiddenCart.length + " товар";
			} else if (arrayHiddenCart.length == 0) {
				document.querySelector('.checkbox__cart_text').textContent = 'Отсутствует  · ' + arrayHiddenCart.length + " товаров";
			} 

		})
	})
} 
deleteProduct()

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
	allQuantityBasket.textContent = numberWithSpaces(value);
	allQuantityBasket.dataset.value = value;
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
					// проходимся циклом по всему массиву из трех товаров, преобразуем их в число после обращаемся
					//к инпутам, а именно в value, позже умножаем также на 	значение инпутов только дата атрибута price, в котором указана его цена

					arrayCart = [...document.querySelectorAll('.product__item_active')] // изначально там лежат 3 товара
					countBasketNumber.textContent = arrayCart.length;
					})
					document.querySelectorAll(".minus").forEach((minusItem) => {
						minusItem.disabled = false;
					})
					document.querySelectorAll(".plus").forEach((plusItem) => {
						plusItem.disabled = false;
					})
					
					deleteCountBasket();

					const defaultButtonBlocked = document.querySelectorAll('.plus')
					defaultButtonBlocked[defaultButtonBlocked.length - 1].disabled = true; // последний плюс на нем должен быть изначально disabled
					//, так как там уже 2 продукта выбрана
			} else {
					childCheckboxs[i].checked = false;
				 	totalCost = 0; // ввывод обычной итовой цены
				 	oldTotalCost = 0; // вывод старой итоговой цены
				 	quantityTotalCost = 0;
				 	sumDiscount.textContent = numberWithSpaces(totalCost - oldTotalCost)  //вывод разницы между старой и новой ценой

					totalPriceWrapper.dataset.value = 0;
					sumOldProducts.dataset.value = 0;
				 	sumOldProducts.textContent = sumOldProducts.dataset.value;
					totalPriceWrapper.textContent = totalPriceWrapper.dataset.value;
				    
				 	countBasketNumber.textContent = arrayCart.length - arrayCart.length;
				 	arrayCart = []; // при клике на главный чекбокс массив становится пустой.

					deleteCountBasket();

				 	allQuantityBasket.textContent = setTotalQuantity(Number(allQuantityBasket.dataset.value) - Number(allQuantityBasket.dataset.value)) 
					document.querySelectorAll(".minus").forEach((minusItem) => {
						minusItem.disabled = true;
					})
					document.querySelectorAll(".plus").forEach((plusItem) => {
						plusItem.disabled = true;
					})

					allQuantityBasket.dataset.value = 0;
					allQuantityBasket.textContent = allQuantityBasket.dataset.value;
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
					countBasketNumber.textContent = arrayCart.length;

					setTotalQuantity(Number(allQuantityBasket.dataset.value) - Number(input.value))

					targetCheckbox.closest('.product__item_active').querySelector(".minus").disabled = true
					targetCheckbox.closest('.product__item_active').querySelector(".plus").disabled = true
					
				} else {
					setTotalPrice(Number(totalPriceWrapper.dataset.value) + Number(input.dataset.price) * (input.value))
					setOldTotalPrice(Number(sumOldProducts.dataset.value) + Number(input.dataset.oldprice) * (input.value))

					sumDiscount.textContent = ' -' + numberWithSpaces((sumOldProducts.dataset.value - totalPriceWrapper.dataset.value))
					
					arrayCart.length++; // увеличиваем длину массива с товарами
					countBasketNumber.textContent = arrayCart.length;
					
					setTotalQuantity(Number(allQuantityBasket.dataset.value) + Number(input.value))

					targetCheckbox.closest('.product__item_active').querySelector(".minus").disabled = false
					targetCheckbox.closest('.product__item_active').querySelector(".plus").disabled = false
				}

				deleteCountBasket()

			})
		}
	}

// 


selectCheckBox()
checkCheckbox()
}

const deleteCountBasket = () => {
	if (arrayCart.length == 0) {
		countBasket.classList.add('none')
	} else {
		countBasket.classList.remove('none')
	}
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
			sumDiscount.textContent = ' -' + numberWithSpaces(Math.round(sumOldProducts.dataset.value - totalPriceWrapper.dataset.value))
			break; // заканчиваем проверку

		case ACTION.MINUS: // обращаемся к объекту действие: минус
			input.value--; // уменьшаем значение value на один
			allQuantityBasket.dataset.value-- // уменьшаем количество товаров на один

			setTotalPrice(Number(totalPriceWrapper.dataset.value) - Number(input.dataset.price))
			setOldTotalPrice(Number(sumOldProducts.dataset.value) - Number(input.dataset.oldprice))

			allQuantityBasket.textContent = Number(allQuantityBasket.dataset.value) // вывод итога в спан
			sumDiscount.textContent = ' -' + numberWithSpaces(Math.round(sumOldProducts.dataset.value - totalPriceWrapper.dataset.value))
			break; // заканчиваем проверку
	}

	basketItem.querySelectorAll('.subtotal').forEach((subtotalItem) => {
		subtotalItem.textContent = numberWithSpaces(Math.round(getItemSubTotalPrice(input))) + " сом" // вывод подытога обычной цены
	})
	basketItem.querySelectorAll('.subtotal-old').forEach((subtotalItem) => {
		subtotalItem.textContent = numberWithSpaces(Math.round(getItemOldTotalPrice(input))) + " сом" // вывод подытога старой цены
	})
	// basketItem.querySelector('.subtotal').textContent = numberWithSpaces(Math.round(getItemSubTotalPrice(input))) + " сом" // вывод подытога обычной цены
	// basketItem.querySelector('.subtotal-old').textContent = numberWithSpaces(Math.round(getItemOldTotalPrice(input))) + " сом" // вывод подытога старой цены
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
		if (input.value == 2) {
			targetProduct.closest('.product__item_active').querySelector(".plus").disabled = true;
		} 
	}


	
	// если у ограниченных продуктов количество равно 2 то блочить кнопку добавление, если изначально стоит 2 также блочить кнопку, а если меньше двух то давать доступ к ней.

	if (targetProduct.classList.contains('minus')) {
		
		if (Number(input.value) !== 0) {
			calculateSeparateItem(
				targetProduct.closest('.product__item_active'), 
				ACTION.MINUS
			)
		}
		if (input.value <= 1){
			targetProduct.closest('.product__item_active').querySelector(".plus").disabled = false;
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

const hiddenPaymentImmediately = () => {
	const checkboxDelivery = document.querySelector('.checkbox__delivery')
	const checkboxSubtotal = document.querySelector('.checkbox__delivery_subtotal')
	const buttonBuy = document.querySelector('.basket-counts__button_buy')

	checkboxDelivery.addEventListener('click', () => {
		if (checkboxDelivery.checked == true) {
	 	  checkboxSubtotal.classList.add('none')
			 buttonBuy.textContent = ` Оплатить ${numberWithSpaces(totalPriceWrapper.dataset.value)} сом` 
	 
	} else {
		checkboxSubtotal.classList.remove('none')
		buttonBuy.textContent = 'Заказать'
	}
	})

}
hiddenPaymentImmediately();
	 


// Показывает информацию о компании которая производит продукт при фокусе на значок инфо
const showInfoBlock = () => {
	const infoButton = document.querySelectorAll('.product__info_button')
	
	infoButton.forEach((infoItem) => {
		infoItem.addEventListener('mouseover', (event) => {
			let currentTarget = event.target
			
			if (currentTarget.classList.contains('product__info_button')) {
				
				currentTarget.closest('.product__item_active').querySelector('.product__block_info').classList.remove('none')

			} 
		})
		infoItem.addEventListener('mouseout', (event) => {
			let currentTarget = event.target

			if (currentTarget.classList.contains('product__info_button')) {
				
				currentTarget.closest('.product__item_active').querySelector('.product__block_info').classList.add('none')

			} 
		})
	})
}
showInfoBlock()

// Показывает информацию о cкидке при фокусе на ценую без скидки
const showInfoBlockDiscount = () => {
	const infoButtonDiscount = document.querySelectorAll('.subtotal__discount');

	infoButtonDiscount.forEach((itemDiscount) => {
		itemDiscount.addEventListener('mouseover', (event) => {
			let currentTarget = event.target;

			if (currentTarget.classList.contains('subtotal__discount')) {
				currentTarget.closest('.product__item_active').querySelector('.product-block_discount').classList.remove('none')
			} 
			
		})
		itemDiscount.addEventListener('mouseout', (event) => {
			let currentTarget = event.target;

			if (currentTarget.classList.contains('subtotal__discount')) {
				currentTarget.closest('.product__item_active').querySelector('.product-block_discount').classList.add('none')
			} 
		})
	})
}
showInfoBlockDiscount()

const showInfoBlockDelivery = () => {
	const infoTextDelivery = document.querySelectorAll('.basket-counts__infoColor');
	
	infoTextDelivery.forEach((itemText) => {
		itemText.addEventListener('mouseover', (event) => {
			let currentTarget = event.target;

			if (currentTarget.classList.contains('basket-counts__infoColor')) {
				currentTarget.closest('.delivery-info').querySelector('.basket__block_info').classList.remove('none')
			} 
		})
			itemText.addEventListener('mouseout', (event) => {
				let currentTarget = event.target;
			
				if (currentTarget.classList.contains('basket-counts__infoColor')) {
					currentTarget.closest('.delivery-info').querySelector('.basket__block_info').classList.add('none')
				} 
			})
	})
}
showInfoBlockDelivery()

const showDeliveryModal = () => {
	const buttonOpenModal = document.querySelectorAll('.delivery__modal_open')
	const modalWindow = document.querySelector('.delivery__pay_modal')
	const closeModalWindow = document.querySelector('.modal-close')

	buttonOpenModal.forEach((buttonItem) => {
		buttonItem.addEventListener("click", () => {
		
			if (modalWindow.classList.contains('none')) {
				modalWindow.classList.remove('none');
				document.querySelector('.delivery__pay_background').classList.remove('none')
			}
			closeModalWindow.addEventListener('click', (event) => {
				let targetCurrent = event.target
	
				if (targetCurrent.classList.contains('modal-close')) {
					modalWindow.classList.add('none');
					document.querySelector('.delivery__pay_background').classList.add('none')
				}
			})
		})
	})
}
showDeliveryModal();

activePoint = () => {
	deliveryPayDeliveryMan.classList.remove('active')
	deliveryPayPoint.classList.add('active')
	pointContent.classList.remove('none')
	payContent.classList.add('none')

	// сбрасывает блокировку кнопок удаления
	deliveryDelete.forEach((deliveryDelete) => {
		deliveryDelete.disabled = false;
	})
}

activePay = () => {
	deliveryPayDeliveryMan.classList.add('active')
	deliveryPayPoint.classList.remove('active')
	payContent.classList.remove('none')
	pointContent.classList.add('none')	
}

const selectButton = () => {

	checkboxRadio.forEach((radioItem) => {
		// изначальные значения выбора способа доставки
	if (deliveryPayDeliveryMan.classList.contains('active')) {
		pointContent.classList.add('none')
	} else {
		pointContent.classList.remove('none')
	}

	deliveryPayPoint.addEventListener('click', () => {	
		activePoint()
		radioItem.checked = false
	})

	deliveryPayDeliveryMan.addEventListener('click', () => {
		activePay()
		radioItem.checked = false
	})
	})
}
selectButton();

const blockButtonDelete = () => {
	checkboxRadio.forEach((radioItem) => {

		radioItem.addEventListener('click', (event) => {
			let target = event.target
			
			deliveryDelete.forEach((deliveryDelete) => {
				deliveryDelete.disabled = false;
			})

			if (radioItem.checked == true) {
				target.closest('.delivery__item').querySelector('.delivery__delete').disabled = true;
				} 
			})
		})
}
blockButtonDelete()

// после того как я нажал на кнопку "Выбрать" все что я нажимал до этого должно отобразиться в соответстующих местах
const selectAddress = () => {

	checkboxRadio.forEach((radioItem) => {
		const resultSelectPay = document.querySelector('.delivery__pay_result');
		const resultSelectPoint = document.querySelector('.delivery__point_result');
		const starIconDeliveryText = document.createElement('img')
		starIconDeliveryText.src += radioItem.dataset.img // вывод звезды в способе оплаты
		starIconDeliveryText.width = 12;
		starIconDeliveryText.height = 12;
		const outputSubtotal = document.querySelector('.delivery__subtotal')
		// контролирует выбор на способе доставки курьером
		resultSelectPay.addEventListener('click', () => {

		if (radioItem.checked == true) {
			outputDeliveryText.textContent = radioItem.dataset.text
			outputBasketCount.textContent = radioItem.dataset.text
			outputSubtotal.innerHTML = ''
		}

		outputText.textContent = "Доставит курьер"
		outputBasket.textContent = "Доставка курьером"
		document.querySelector('.delivery__pay_modal').classList.add('none')
		document.querySelector('.delivery__pay_background').classList.add('none')

	})

// контролирует выбор на способе доставки пункт выдачи
	resultSelectPoint.addEventListener('click', () => {
	
		if (radioItem.checked == true) {
			outputDeliveryText.textContent = radioItem.dataset.text 
			outputSubtotal.innerHTML = ` <img src="./images/star.svg"> ` + radioItem.dataset.rating + " Ежедневно с 10 до 21 "
			outputBasketCount.textContent = radioItem.dataset.text 
		} 
		
		outputText.textContent = "В пункт выдачи"
		outputBasket.textContent = "Доставка в пункт выдачи"
		document.querySelector('.delivery__pay_modal').classList.add('none')
		document.querySelector('.delivery__pay_background').classList.add('none')

	})
})
}
selectAddress()

const deliveryItemDelete = () => {
	const buttonsPayDelete = document.querySelectorAll('.delivery__delete')
	buttonsPayDelete.forEach((payDeleteItem) => {
		
		payDeleteItem.addEventListener('click', (event) => {
			let target = event.target
			let deliveryItem = target.closest('.delivery__parent').querySelector('.delivery__delete')
			if(deliveryItem) {
				target.closest('.delivery__item').classList.add('none')
			} 
		})
	})
}
deliveryItemDelete();

const showCardModal = () => {

	const buttonCardOpen = document.querySelectorAll('.delivery__card_open')
	const modalCardWindow = document.querySelector('.delivery__card_modal')
	const closeModalCardWindow = document.querySelector('.modal-card_close')

	buttonCardOpen.forEach((buttonItem) => {
		buttonItem.addEventListener("click", () => {
		
			if (modalCardWindow.classList.contains('none')) {
				modalCardWindow.classList.remove('none');
				document.querySelector('.delivery__card_background').classList.remove('none')
			}
		})
	 })

	 closeModalCardWindow.addEventListener('click', (event) => {
		let targetCurrent = event.target

		if (targetCurrent.classList.contains('modal-card_close')) {
			modalCardWindow.classList.add('none');
			document.querySelector('.delivery__card_background').classList.add('none')
		}
	})
	
}
showCardModal()


selectCardInput = () => {
	const cardInput = document.querySelectorAll('.delivery__card_input')
	const outputCard = document.querySelectorAll('.card-details')
	const cardIcon = document.createElement('img')
	 // вывод звезды в способе оплаты

	cardInput.forEach((cardItem) => {
		outputCard.forEach((outputItem) => {
		cardIcon.src = cardItem.dataset.img
		
		const resultSelectCard = document.querySelector('.delivery__card_result');
		
		
		// контролирует выбор на способе доставки курьером
		resultSelectCard.addEventListener('click', () => {
		
		if (cardItem.checked) {
			outputItem.innerHTML = `<img src="${cardItem.dataset.img}">` + cardItem.dataset.text 
		}

		document.querySelector('.delivery__card_modal').classList.add('none')
		document.querySelector('.delivery__card_background').classList.add('none')

	})
})
	})
}
selectCardInput()

const phone = document.querySelector('.form__input_phone');
const nameForm = document.querySelector('.form__input_name');
const surname = document.querySelector('.form__input_surname');
const email = document.querySelector('.form__input_email');
const Inn = document.querySelector('.form__input_INN');
const errorValidate = document.querySelectorAll('.error');
const form = document.querySelector('.delivery__form');



const mask = new IMask(phone, {
	mask: "+{0} 000 000-00-00",
});



const validateForm = () => {
	const formInputs = document.querySelectorAll('.form__input');

	
	formInputs.forEach((InputItems => {
		InputItems.addEventListener('blur', (event) => {
		let target = event.target;
			if (target.classList.contains('form__input')) {
				validateInputs();
			}	
		})
	})
)
}


// функция вывода ошибки
const setError = (element, message) => {
	// получаем родительский элемент
	const inputControl = element.parentElement;
	// получаем в каждом родительском элементе, блок вывода error
	const errorDisplay = inputControl.querySelector('.error');

	errorDisplay.innerText = message;
	inputControl.classList.add('error');
}

const setSuccess = element => {
	const inputControl = element.parentElement
	const errorDisplay = inputControl.querySelector('.error');

	errorDisplay.innerText = '';
	inputControl.classList.remove('error');
	inputControl.classList.add('success');
}

const isValidEmail = email => {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}
const isValidPhone = phone => {
	let regex = /^(\+9|\0\|)?[\s\-]?\(?[1234567890][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
	return regex.test(phone);
}

const isValidInn = Inn => {
	const re = /^([0-9]{12})$/
	return re.test(Inn)
}

const validateInputs = () => {
	// получаем value каждого инпута и с помощью trim() удаляем все пробелы с начала и конца
	const usernameValue = nameForm.value.trim(); 
	const surnameValue = surname.value.trim(); 
	const emailValue = email.value.trim(); 
	const phoneValue = phone.value.trim(); 
	const InnValue = Inn.value.trim(); 
	

	if (usernameValue == '') {
		setError(nameForm, 'Укажите имя');
	}else {
		setSuccess(nameForm);
	}	

	if (surnameValue == '') {
		setError(surname, 'Укажите фамилию');
	}else {
		setSuccess(surname);
	}
	
	if (emailValue == '') {
		setError(email, 'Укажите email');
	}else if (!isValidEmail(emailValue)){
		setError(email, 'Проверьте адрес электронной почты');
	}	else { 
		setSuccess(email);
	}

	if (phoneValue == '') {
		setError(phone, 'Введите номер телефона');
	}else if (!isValidPhone(phoneValue)) {
		setError(phone, 'Формате: +9 999 999-99-99')
	} else {
		setSuccess(phone);
	}	

	if (InnValue == '') {
		setError(Inn, 'Укажите ИНН');
	}else if (!isValidInn(InnValue)) {
		setError(Inn, 'Формате: |123456787899| 12 цифр')
	} else {
		setSuccess(Inn);
	}
}
	
validateForm()

init();

// получить каждый инпут у доставки курьером и пункт выдачи, а также адреса и удаление
// при нажатии определенную радио кнопку меняется контент
