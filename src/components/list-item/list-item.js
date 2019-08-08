import React, { Component } from 'react';
import './list-item.css';

export default class ListItem extends Component{

    addingSpaces(number){
        if (number){
            return number.toLocaleString().replace(/,/g, ' ');
        }
    }

    render(){
        const { title, price, pictures, name, onFavourite, favourite } = this.props;

        let faItem = 'fas fa-heart';

        if (favourite) {
            faItem += ' red';
        }

        return(
            <span className='wrap'>
                <div className='image'>
                    <img src= { pictures } alt='img'/>
                    <p>{ '+' + (pictures.length - 1) }</p>
                </div>
                <span className='card-body'>
                    <h3 className='item-title'>{ title }</h3>
                    <h4 className='seller-info'>{ name }</h4>
                    <h4 className='price'>{ this.addingSpaces(price) }</h4>
                    <i className={ `${ faItem }` } onClick = { onFavourite }></i>
                </span>
            </span>
        )
    }
}