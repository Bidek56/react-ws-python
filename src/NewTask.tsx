
import React from 'react'
import PropTypes from 'prop-types'
import { StatusContext, contextType } from './StatusContext';
import { InputLabel, FormControl, FormLabel, FormGroup, CircularProgress, TextField, Select, MenuItem, Grid, Button, SelectChangeEvent } from '@mui/material';
import { Send } from '@mui/icons-material';

const selectAnimals = ['Dog', 'Cat']
const animalMenu = selectAnimals.map((name, key) => <MenuItem key={key} value={name}>{name}</MenuItem>)

const catBreeds = ['Aegean', 'American Bobtail', 'American Curl', 'Asian cat']
const catBreedMenu = catBreeds.map((name, key) => <MenuItem key={key} value={name}>{name}</MenuItem>)

const dogBreeds = ['Affenpinscher', 'Akbash', 'Akita Chow', 'Bassador']
const dogBreedMenu = dogBreeds.map((name, key) => <MenuItem key={key} value={name}>{name}</MenuItem>)

interface ICustomInput {
    label: string
    name: React.MutableRefObject<string>
}

// Custom text field
const CustomTextField = (ref: React.PropsWithChildren<ICustomInput>): JSX.Element => {
    return (
        <TextField sx={{ margin: 8, width:500 }}
            variant="standard"
            type="string"
            label={ref.label}
            defaultValue={ref.name.current}
            onChange={e => ref.name.current = e.target.value}
        />
    )
};

const NewTask = ({token}: {token: string|null}) => {
  
  const [selectedAnimal, setSelectedAnimal] = React.useState<string>(selectAnimals[0])
  const [selectedCatBreed, setSelectedCatBreed] = React.useState<string>(catBreeds[0])
  const [selectedDogBreed, setSelectedDogBreed] = React.useState<string>(dogBreeds[0])

  const dogNameRef = React.useRef('Pluto')
  const catNameRef = React.useRef('Pubs')

  const { ws, running, setLog } = React.useContext<contextType>(StatusContext);

  const onSelectedAnimalChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
      setSelectedAnimal(event.target.value as string)
      console.log("Selected:", event.target.value)
  }

  const onSelectedCatBreedChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    setSelectedCatBreed(event.target.value as string)
    console.log("Selected:", event.target.value)
  }

  const onSelectedDogBreedChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    setSelectedDogBreed(event.target.value as string)
    console.log("Breed:", event.target.value)
  }

  const sumitTask = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    let breed: string | null = null;
    const animal = selectedAnimal;
    if (selectedAnimal === selectAnimals[0]) {
      breed = selectedCatBreed;
    } else if (selectedAnimal === selectAnimals[1]) {
      breed = selectedDogBreed;
    }

    setLog(undefined);
    ws?.current.send(JSON.stringify({ action: "doTask", token, animal, breed }));
  }

  return (
    <Grid container>
      <Grid item xs={3}>
        <FormControl component="fieldset">
          <FormLabel sx={{ marginLeft: 0, marginRight: 0, fontSize: 18,}} component="legend">Animal</FormLabel>
          <FormGroup>
            <Select variant="outlined" value={selectedAnimal} onChange={onSelectedAnimalChange} >
              {animalMenu}
            </Select>
            <br />
            {running ?
              <CircularProgress sx={{py: 2 }}/> :
              <Button sx={{py: 1 }} variant="contained" color="primary" onClick={sumitTask} endIcon={<Send />}>Run</Button>
            }
          </FormGroup>
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        {selectedAnimal === selectAnimals[0] &&
          <Grid container direction="column">
            <CustomTextField label="Dog name" name={dogNameRef} />
            <InputLabel id="dogBreedSelect">Dog Breed</InputLabel>
            <Select labelId="dogBreedSelect" variant="outlined" value={selectedDogBreed} onChange={onSelectedDogBreedChange} >
              {dogBreedMenu}
            </Select>
          </Grid>
        }
        {selectedAnimal === selectAnimals[1] &&
          <Grid container direction="column">
            <CustomTextField label="Cat name" name={catNameRef} />
            <InputLabel id="breedSelect">Cat Breed</InputLabel>
            <Select labelId="catBreedSelect" variant="outlined" value={selectedCatBreed} onChange={onSelectedCatBreedChange} >
              {catBreedMenu}
            </Select>
          </Grid>
        }
      </Grid>
    </Grid>    
  );
}

NewTask.propTypes = {
  token: PropTypes.string
}

export default NewTask;