
import React from 'react'
import PropTypes from 'prop-types'

type Dispatcher<S> = React.Dispatch<React.SetStateAction<S>>;
type ScrollProp = {setShowModal: Dispatcher<boolean>, path: string|undefined};

export const ScrollModal = ({setShowModal, path }: ScrollProp) => {

  const [logContent, setLogContent] = React.useState<string|null>(null);

  // Similar to componentDidMount and componentDidUpdate:
  React.useEffect(() => {
    const fetchLog = async () => {
      const response = await fetch(`/log`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ path })
      })

      // console.log("Res:", response)

      if (response.ok) {
        const body = await response.json()        
        setLogContent(body?.content)
      }
    }

    fetchLog()
  },[path]);

  const onClose = ( event: React.MouseEvent<HTMLButtonElement, MouseEvent> ) => {
    setShowModal(false)
  }

  return !path ? null :
      <div>Log for: {path}<br/>
        {logContent}
        <div>
          <button className="btn btn-outline-danger" onClick={onClose}>Close</button>
        </div>
      </div>
}

ScrollModal.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired
}

interface IMessage {
  count: number;
  log?: string;
  completed: number;
  type: string;
}

export const NewTask = () => {

  // const [ws, setWs] = React.useState<any>(null);

  const ws: any = React.useRef<any| null>(null);
	const [completedCount, setCompletedCount] = React.useState<number>(0);
  const [log, setLog] = React.useState<string | undefined>(undefined);

  const [showModal, setShowModal] = React.useState<boolean>(false);
	const [userCount, setUserCount] = React.useState<number>(0);

  // car selection
  const carNames = ['Volvo', 'Saab', 'Mercedes', 'Audi']
  const selectCar = carNames.map((name, key) => <option key={key} value={name}>{name}</option>)
  const [selectedCar, setSelectedCar] = React.useState<string>(carNames[0])

  // color selection
  const colorNames = ['blue', 'red', 'pink']
  const selectColor = colorNames.map((name, key) => <option key={key} value={name}>{name}</option>)
  const [selectedColor, setSelectedColor] = React.useState<string>(colorNames[0])

  // model selection
  const modelNames = ['compact', 'sedan', 'SUV']
  const selectModel = modelNames.map((name, key) => <option key={key} value={name}>{name}</option>)
  const [selectedModel, setSelectedModel] = React.useState<string>(modelNames[0])

  const onSelectChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    console.log(event.target.value)
    setSelectedCar(event.target.value as string)
  }

  const onSelectColorChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    // console.log(event.target.value)
    setSelectedCar(event.target.value as string)
  }

  const onSelectModelChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    // console.log(event.target.value)
    setSelectedModel(event.target.value as string)
  }

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // console.log('Submitted: ' + selectedCar + ":" + selectedColor + ":" + selectedModel);

    setLog(undefined);
    ws?.current.send(JSON.stringify({ action: "doTask", car: selectedCar, model: selectedModel, color: selectedColor }));
  }
 
  const handleLogClick = ( event: React.MouseEvent<HTMLButtonElement, MouseEvent> ) => {
    // console.log("Showing log for: ", log)
    setShowModal(true)
  }

 	const onReceiveMessage = ({ data }: { data: string; }) => {
		const obj: IMessage | null = JSON.parse(data);

    if (!obj)
      return

		switch (obj.type) {
      case "state":
        setCompletedCount(obj?.completed);
        setLog(obj?.log)
        break;
      case "users":
        setUserCount(obj?.count);
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

  return (
    <div>
      <h5 className="text-center">Input</h5>
      <div className="input-group mb-3">
        <label htmlFor="cars" className="input-group-text">Choose car:</label>
        <select className="form-select" name="cars" id="cars" onChange={onSelectChange} >
          {selectCar}
        </select>
        <label htmlFor="colors" className="input-group-text">Choose color:</label>
        <select className="form-select" name="colors" id="colors" onChange={onSelectColorChange} >
          {selectColor}
        </select>
      </div>
      <div className="input-group mb-3">        
        <label htmlFor="models" className="input-group-text">Choose model:</label>
        <select className="form-select" name="models" id="colors" onChange={onSelectModelChange} >
          {selectModel}
        </select>        
      </div>
      <button className="btn btn-outline-primary" onClick={handleSubmit}>Submit</button>
      <br/>
      <br/>
      <h5 className="text-center">Output</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Users</th>
            <th scope="col">Completed</th>
            <th scope="col">Log</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{userCount}</td>
            <td>{completedCount}</td>
            <td>{ log &&
              <button className="btn btn-outline-primary" onClick={handleLogClick}>Show Log</button> }
            </td>
          </tr>
        </tbody>
      </table>
      {showModal && <ScrollModal setShowModal={setShowModal} path={log}/> }
    </div>
  );
}