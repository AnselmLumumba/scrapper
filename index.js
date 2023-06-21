/*const axios=require("axios");
const cheerio=require("cheerio");
const fetchTitles=async() => {
try {
const response=await
axios.get('https://www.businesslist.co.ke/category/restaurants');
const html = response.data;
const $ = cheerio.load(html);
const title_names = [];
$('div >h4>a').each((_idx, el) => {
const title_name = $(el).text()
title_names.push(title_name)
});
return title_names;
} catch (error) {
throw error;
}};
fetchTitles().then((title_names) => console.log(title_names));*/

const axios = require("axios");
const cheerio = require("cheerio");
const mysql = require("mysql");

const fetchRestaurantData = async () => {
  try {
    const response = await axios.get('https://www.businesslist.co.ke/category/restaurants');
    const html = response.data;
    const $ = cheerio.load(html);
    const restaurants = [];

    $('div > .company').each((_idx, el) => {
      const companyName = $(el).find('h4 > a').text().trim();
      const address = $(el).find('.address').text().trim();
      const description = $(el).find('.desc').text().trim();
      restaurants.push({ companyName, address, description });
    });

    return restaurants;
  } catch (error) {
    throw error;
  }
};

fetchRestaurantData().then(async (restaurants) => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'anselm'
    });

    // Create a table to store the data
    await connection.query(`
      CREATE TABLE  restaurants (
        id INT PRIMARY KEY AUTO_INCREMENT,
        companyName VARCHAR(255),
        address VARCHAR(255),
        description TEXT
      )
    `);

    // Insert the data into the table
    for (const restaurant of restaurants) {
      await connection.query('INSERT INTO restaurants (companyName, address, description) VALUES (?, ?, ?)', [
        restaurant.companyName,
        restaurant.address,
        restaurant.description
      ]);
    }

    console.log('Data inserted successfully');
    connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
});




