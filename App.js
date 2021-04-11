import React from 'react';
import { Alert } from 'react-native';
import Loading from './Loading';
import * as Location from "expo-location";
import axios from 'axios';
import Weather from './Weather';

const API_KEY = "9ab9d65b306457907237f3d59882fe3f";

export default class extends React.Component {
  state = {
    isLoading: true,
  };

  // Call Weather API 
  getWeather = async(latitude, longitude) => {
    const { 
      data: {
        main: {temp},
        weather
      } 
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    this.setState({
      isLoading: false, 
      condition: weather[0].main,
      temp
    });    
  };

  // Get Location 
  getLocation = async () => {
    try {
      // 1. Get Permission
      await Location.requestPermissionsAsync();
      // 2. Get Location
        const {coords: { latitude, longitude }} 
                        = await Location.getCurrentPositionAsync();
        this.getWeather(latitude, longitude);
    } catch (e) {
      Alert.alert("Can't find you.", "So sad");
      console.error(e);
    }
  };

  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading, temp, condition } = this.state;
    console.log( temp );
    return isLoading ? <Loading /> : <Weather temp={temp} condition={condition}/>;
  }
}