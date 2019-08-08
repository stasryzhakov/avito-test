import React, { Component } from 'react';
import Service from '../../service/avito-service';
import ProductsList from '../products-list';
import FilterSort from '../filter-sort';
import './app.css';


export default class App extends Component{

    service = new Service();

    state = {
        data: [],
        category: '',
        priceStart: '',
        priceEnd: '',
        favourites: false
    }

    //  получаем все данные уже совмещенные и добавляем их в state
    //  далее добавляем в каждый объект свойство favourite для последующей фильтрации
    //  и создаем отдельный массив для последующей фильтрации по категории
    getItem = () => {
        this.service
            .mergeData()
            .then((body) => {
                this.setState({
                    data: body
                },
                () => {
                    this.addFavourites();
                },
                () => {
                    this.dataToFilter();
                });
            });
    }

    // проверяем если в нашем localStorage не имеется data, если нет, то грузим с сервера
    // если да, то из localStorage
    componentDidMount(){
        if (!localStorage.getItem('data')){
            this.getItem();
        }
    }

    // добавляем свойство favourite и записываем с state
    addFavourites() {
        let newData = this.state.data.map((e) => {
            e.favourite = false;
            return e;
        });
        this.setState({
            data: newData
        })
    }

    // создаем отдельный массив для фильтрации по категориям
    dataToFilter() {
        const dataFilter = this.state.data.map((e) => {
            return e.category;
        });
        return dataFilter.filter((e,idx,self) => {
            return self.indexOf(e) === idx;
        });
    }

    // при нажатии на добавить в избранное у каждого элемента
    // сначала находим индекс этого элемента, возможно такой поиск не самый эффективный,
    // но, наверное, самый точный, потом меняем его значение в state с true на false или наоборот
    // и создаем новый массив data, который и записываем в state
    onFavourite = (lat, lng, category, price) => {
        this.setState(({ data }) => {
            const index = data.findIndex((el) => 
                (el.address.lat === lat && el.address.lng === lng 
                && el.price === price && el.category === category));
            const oldItem = data[index];
            const newItem = { ...oldItem, favourite: !oldItem.favourite};
            const newData = [
                ...data.slice(0, index),
                newItem,
                ...data.slice(index + 1)  
            ];

            return {
                data: newData
            }
        })
    }

    // в зависимости от выбранного фильтра, записываем в state
    // в фильтре по цене используем дополнительную переменную, чтобы
    // запись в state производилась по нажатии кнопки 'Применить'
    changeFilter = (type, val) => {
        switch(type) {
            case 'category':
                this.setState({ category: val });
                break;
            case 'priceStart':
                let inputValueStart = Number(val);
                this.setState(({ priceStart }) => {
                    return {
                        priceStart: priceStart,
                        inputValueStart
                    }
                });
                break;
            case 'priceEnd':
                let inputValueEnd = Number(val);
                this.setState(({ priceEnd }) => {
                    return {
                        priceStart: priceEnd,
                        inputValueEnd
                    }
                });
                break;
            case 'favourite':
                this.setState({ favourites: !this.state.favourites });
            default:
                break;
        }
    }

    // осуществляем сортировку
    sortBy = (searchTerm) => {
        const { data } = this.state;

        if (!searchTerm) {
            this.getItem();
        } else if (searchTerm === 'price') {
             this.setState({ 
                data: [...data].sort((a,b) => a[searchTerm] - b[searchTerm])
            });
        } else{
            this.setState({ 
                data: [...data].sort((a, b) => b[searchTerm] - a[searchTerm])
            });
        }
      }

    // применяем фильтр по цене по нажатии кнопки 'Применить' 
    submitFitler = (event) => {
        event.preventDefault();
        this.setState({
            priceStart: this.state.inputValueStart,
            priceEnd: this.state.inputValueEnd
        });
    }

    // осуществление нескольких фильтров одновременно
    getFiltered = () => {
        const { data, category, priceStart, priceEnd, favourites } = this.state;
        if( category || priceStart || priceEnd || favourites){
             return data.filter(this.filterData);
        } else {
           return data;
        }
    }

    filterData = (data) => {
        let { category, priceStart, priceEnd, favourites } = this.state;
        if (category && data.category !== category) return false;
        if (priceStart && data.price < priceStart) return false;
        if (priceEnd && data.price > priceEnd) return false;
        if (favourites && !data.favourite) return false;
        return true;
    }
    
    // запись полученныъ данных с сервера в localStorage и их получение на страницу
    componentWillMount() {
        localStorage.getItem('data') && this.setState({
            data: JSON.parse(localStorage.getItem('data'))
        })
    }
    

    componentWillUpdate(nextProps, nextState){
        localStorage.setItem('data', JSON.stringify(nextState.data));
    }

    render(){

        const { data, category } = this.state;
        const categoryArray = this.dataToFilter();
        const visible = data.filter(this.filterData);

        return(
            <div className="container">
                <div className="row">
                    <div className='wrapper col-sm'>
                        <h1>Объявления Avito</h1>
                        <FilterSort 
                            filter = { category }
                            data = { data }
                            sortBy = { this.sortBy }
                            submitFitler = { this.submitFitler }
                            changeFilter = { this.changeFilter }
                            categoryArray = { categoryArray }/>
                        <ProductsList
                            card = { visible }
                            onFavourite = { this.onFavourite }
                            />
                    </div>
                </div>
            </div>
        );
    };
}