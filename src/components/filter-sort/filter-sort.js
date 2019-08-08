import React,{ Component } from 'react';
import './filter-sort.css';

export default class FilterSort extends Component {

    categories = ['Все', 'Автомобили', 'Ноутбуки', 'Камеры', 'Недвижимость'];

    render(){ 

        const { data, filter, changeFilter, submitFitler, categoryArray, sortBy} = this.props;
        categoryArray.unshift('');
        const categories = this.categories;
        const options = categoryArray.map((name,i) => ({name, label: categories[i]}));
        const option = options.map(({ name, label }) => {
            return (
                <option key={name} value={name}>
                  { label }
                </option> 
            )
        })

        return (
                <div className="filter-sort d-flex ">
                    <div className="filter">
                        <div className='category d-flex'>
                                <h5>По категории</h5>
                                <select 
                                    id = 'category'
                                    value = {filter}
                                    onChange = { (event) =>  changeFilter('category', event.target.value, data) }>
                                    { option }
                                </select>
                            </div>
                        <div className="price-filter d-flex">
                            <h5>По цене</h5>
                            <div className="input-group ">
                                <input type='number' placeholder='с'
                                        onChange = { (event) =>  changeFilter('priceStart', event.target.value) }/>
                                <input type="number" 
                                        placeholder='до' ref = { el => this.element = el } 
                                        onChange = { (event) =>  changeFilter('priceEnd', event.target.value) }/>
                                <div className="input-group-append">
                                    <button 
                                        className="btn btn-outline-secondary" 
                                        type="button"
                                        onClick = { submitFitler }>Применить</button>
                                </div>
                            </div>
                        </div> 
                        <button 
                            className='btn btn-outline-secondary'
                            onClick = { () => changeFilter('favourite') }>
                            Показать избранное
                        </button>
                    </div>
                    <div className="sort">
                            <h5>Сортировать</h5>
                            <div className="btn-group">
                                <button name='' className={`btn btn-outline-secondary`}onClick = { () => sortBy('')} >По порядку</button>
                                <button name='rating' className={`btn btn-outline-secondary`} onClick = { () => sortBy('rating') } >По популярности</button>
                                <button name='price' className={`btn btn-outline-secondary`} onClick = { () => sortBy('price') }>По цене </button>
                            </div>
                        </div>
                </div>
        )
    }
}