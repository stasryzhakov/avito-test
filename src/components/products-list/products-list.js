import React, { Component } from 'react';
import ListItem from '../list-item/';
import './products-list.css';

export default class ProductsList extends Component {   

    render(){
        const { card, onFavourite } = this.props;
        const items = card.map((item, index) => {
            return (
                <li key={index} className='list-group-item card'>
                    <ListItem 
                        name = { item.name + ' ' +  item.rating }
                        title = { item.title }
                        favourite = { item.favourite }
                        price = { item.price }
                        pictures = { item.pictures }
                        onFavourite = { () => onFavourite(item.address.lat, item.address.lng, item.category, item.price) }
                        id= { item.id }/>
                </li>
            );
        })

        return (
            <ul className='list-group'>
                { items }
            </ul>
        )
    }
}