class Service {
    api = 'https://avito.dump.academy';
  
    async getData(url){
      let res = await fetch(`${this.api}${url}`);
      
      if (!res.ok){
        throw new Error();
      }
      return await res.json();
    }

    // получаем массив продуктов из api
    async getProducts(){
      const res = await this.getData(`/products/`);
      return res.data;
    }

    // получаем массив продавцов из api
    async getSellers(){
      const res = await this.getData(`/sellers/`);
      return res.data;
    }

    // добавляем данные продавцов к продуктам, если id продавца совпадает с id продавца в массиве продуктов
    async mergeData(){
      let product = await this.getProducts();
      let seller = await this.getSellers();

      let merged = [];

      for(let i=0; i<product.length; i++) {
        merged.push({
        ...product[i], 
        ...(seller.find((e) => e.id === product[i].relationships.seller))}
        );
      }
      return merged;
    }
}

export default Service;