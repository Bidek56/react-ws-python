
import React from 'react'

import { StatusContext } from './StatusContext';
import { InputLabel, FormControl, FormLabel, FormGroup, CircularProgress, TextField, Select, MenuItem, Grid, Button } from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Send } from '@material-ui/icons';

interface IMessage {
  count: number;
  log?: string;
  completed: number;
  type: string;
}

const selectAnimals = ['Dog', 'Cat']
const animalMenu = selectAnimals.map((name, key) => <MenuItem key={key} value={name}>{name}</MenuItem>)

const catBreeds = ['Aegean', 'American Bobtail', 'American Curl', 'Asian cat']
const catBreedMenu = catBreeds.map((name, key) => <MenuItem key={key} value={name}>{name}</MenuItem>)

const dogBreeds = ['Affenpinscher', 'Akbash', 'Akita Chow', 'Bassador']
const dogBreedMenu = dogBreeds.map((name, key) => <MenuItem key={key} value={name}>{name}</MenuItem>)

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
        },
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        textField: {
            margin: 8,
            width: 500.
        },
        labelRoot: {
            marginLeft: 0,
            marginRight: 0,
            fontSize: 18,

        },
        progress: {
            margin: theme.spacing(2),
        },
        selectEmpty: {
            marginTop: theme.spacing(1),
            marginLeft: theme.spacing(1)
        },
    }),
);

interface ICustomInput {
    classes: any
    label: string
    name: React.MutableRefObject<string>
}

// Custom text field
const CustomTextField: React.FC<ICustomInput> = (ref: React.PropsWithChildren<ICustomInput>): JSX.Element => {
    return (
        <TextField className={ref.classes.textField}
            InputLabelProps={{ classes: { root: ref.classes.labelRoot } }}
            variant="standard"
            type="string"
            label={ref.label}
            defaultValue={ref.name.current}
            onChange={e => ref.name.current = e.target.value}
        />
    )
};

export const NewTask = () => {

  const ws: any = React.useRef<any| null>(null);
  const [selectedAnimal, setSelectedAnimal] = React.useState<string>(selectAnimals[0])
  const [selectedCatBreed, setSelectedCatBreed] = React.useState<string>(catBreeds[0])
  const [selectedDogBreed, setSelectedDogBreed] = React.useState<string>(dogBreeds[0])

  const dogNameRef = React.useRef('Pluto')
  const catNameRef = React.useRef('Pubs')

  const { running } = React.useContext<{ running: boolean; setRunning: React.Dispatch<React.SetStateAction<boolean>>; }>(StatusContext);

  const onSelectedAnimalChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      setSelectedAnimal(event.target.value as string)
      console.log("Selected:", event.target.value)
  }

  const onSelectedCatBreedChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setSelectedCatBreed(event.target.value as string)
    console.log("Selected:", event.target.value)
  }

  const onSelectedDogBreedChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setSelectedDogBreed(event.target.value as string)
    console.log("Breed:", event.target.value)
  }

  // const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   // console.log('Submitted: ' + selectedCar + ":" + selectedColor + ":" + selectedModel);

  //   setLog(undefined);
  //   ws?.current.send(JSON.stringify({ action: "doTask", car: selectedCar, model: selectedModel, color: selectedColor }));
  // }
 
  // const handleLogClick = ( event: React.MouseEvent<HTMLButtonElement, MouseEvent> ) => {
  //   // console.log("Showing log for: ", log)
  //   // setShowModal(true)
  // }

 	const onReceiveMessage = ({ data }: { data: string; }) => {
		const obj: IMessage | null = JSON.parse(data);

    if (!obj)
      return

		switch (obj.type) {
      case "state":
        // setCompletedCount(obj?.completed);
        // setLog(obj?.log)
        break;
      case "users":
        // setUserCount(obj?.count);
        break;
      default:
        console.error("unsupported event", data);
		}
	};

  React.useEffect(() => {
		ws?.current?.close();

		try {

			ws.current = new WebSocket(`ws://localhost:6789`);

			console.log("WS:", ws.current)

			if (ws.current) {
				ws.current.addEventListener("message", onReceiveMessage);
			}

			return () => {
				ws.current.removeEventListener("message", onReceiveMessage);
			};
		}
		catch(err) {
			console.error(err.message);
		}
	}, [ws]);

  const sumitTask = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    console.log("Task....")
  }

  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={3}>
        <FormControl component="fieldset">
          <FormLabel className={classes.labelRoot} component="legend">Animal</FormLabel>
          <FormGroup>
            <Select variant="outlined" value={selectedAnimal} onChange={onSelectedAnimalChange} >
              {animalMenu}
            </Select>
            <br />
            {running ?
              <CircularProgress className={classes.progress} /> :
              <Button className={classes.button} variant="contained" color="primary" onClick={sumitTask} endIcon={<Send />}>Run</Button>
            }
          </FormGroup>
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        {selectedAnimal === selectAnimals[0] &&
          <Grid container direction="column">
            <CustomTextField label="Dog name" classes={classes} name={dogNameRef} />
            <InputLabel id="dogBreedSelect">Dog Breed</InputLabel>
            <Select labelId="dogBreedSelect" variant="outlined" value={selectedDogBreed} onChange={onSelectedDogBreedChange} >
              {dogBreedMenu}
            </Select>
          </Grid>
        }
        {selectedAnimal === selectAnimals[1] &&
          <Grid container direction="column">
            <CustomTextField label="Cat name" classes={classes} name={catNameRef} />
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