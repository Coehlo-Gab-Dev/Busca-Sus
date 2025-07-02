import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema({
  placeId: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    text: String,
    languageCode: String,
  },
  formattedAddress: String,
  nationalPhoneNumber: String,
  municipio: String, // Para qual município este lugar pertence
  category: String, // Categoria que foi buscada
  geometry: { 
    location: {
      lat: Number,
      lng: Number,
    },
    viewport: {
      northeast: { lat: Number, lng: Number },
      southwest: { lat: Number, lng: Number },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Place = mongoose.model('Place', PlaceSchema);

export default Place;
