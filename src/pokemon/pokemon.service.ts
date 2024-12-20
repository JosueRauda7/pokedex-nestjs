import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  private defaultOffset: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit');
    this.defaultOffset = this.configService.get<number>('defaultOffset');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Ya existe un Pokemon con ${JSON.stringify(error.keyValue)}`,
        );
      }
      console.log(error);
      throw new Error('Error en la creación del Pokemon - Verificar logs');
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = this.defaultOffset } =
      paginationDto;
    const pokemons = this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
    return pokemons;
  }

  async findOne(searchTerm: string) {
    let pokemon: Pokemon;
    // Búsqueda por número
    if (!isNaN(Number(searchTerm))) {
      pokemon = await this.pokemonModel.findOne({ no: searchTerm });
    }
    // Búsqueda por mongoId
    if (!pokemon && isValidObjectId(searchTerm)) {
      pokemon = await this.pokemonModel.findOne({ _id: searchTerm });
    }
    // Búsqueda por nombre
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: searchTerm.toLowerCase(),
      });
    }
    // Si no encuentra, regresará error 404
    if (!pokemon) {
      throw new NotFoundException(
        `No se encontró un Pokemon con la siguiente búsqueda: "${searchTerm}"`,
      );
    }
    return pokemon;
  }

  async update(searchTerm: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      let pokemon: Pokemon;
      // Búsqueda por número
      if (!isNaN(Number(searchTerm))) {
        pokemon = await this.pokemonModel.findOne({ no: searchTerm });
      }
      // Búsqueda por mongoId
      if (!pokemon && isValidObjectId(searchTerm)) {
        pokemon = await this.pokemonModel.findOne({ _id: searchTerm });
      }
      // Búsqueda por nombre
      if (!pokemon) {
        pokemon = await this.pokemonModel.findOne({
          name: searchTerm.toLowerCase(),
        });
      }
      // Si no encuentra, regresará error 404
      if (!pokemon) {
        throw new NotFoundException(
          `No se encontró un Pokemon con la siguiente búsqueda: "${searchTerm}"`,
        );
      }
      const pokemonActualizado = this.pokemonModel.updateOne(
        { no: pokemon.no },
        updatePokemonDto,
      );
      return pokemonActualizado;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Ya existe un Pokemon con ${JSON.stringify(error.keyValue)}`,
        );
      }
      console.log(error);
      throw new Error('Error en la creación del Pokemon - Verificar logs');
    }
  }

  async remove(searchTerm: string) {
    const pokemonEliminado = await this.pokemonModel.deleteOne({
      _id: searchTerm,
    });
    if (!pokemonEliminado.deletedCount) {
      throw new NotFoundException(
        `No se encontró un Pokemon con la siguiente búsqueda: "${searchTerm}"`,
      );
    }
    return pokemonEliminado;
  }

  async createMany(pokemons: CreatePokemonDto[]) {
    try {
      pokemons.forEach((pokemon) => {
        pokemon.name = pokemon.name.toLowerCase();
      });
      const pokemonsCreados = await this.pokemonModel.create(pokemons);
      return pokemonsCreados;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Ya existe un Pokemon con ${JSON.stringify(error.keyValue)}`,
        );
      }
      console.log(error);
      throw new Error('Error en la creación del Pokemon - Verificar logs');
    }
  }
}
