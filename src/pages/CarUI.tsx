import React, { useState } from "react";
import { ABI } from "@/ABI";
import Web3 from "web3";

const web3 = new Web3("https://sepolia.infura.io/v3/ec84c9b967de4010b5ace262fa78bb6e");

export default async function CarUI() {
    const [owner, setOwner] = useState("");
    const [model, setCarModel] = useState("");
    const [createdCar, setCreatedCar] = useState<any>(null);
    const [retriveCar, setRetriveCar] = useState<any>(null);
    const [carIndex, setCarIndex] = useState<number>(0);

    const handleCarSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(
            ABI as any,
            "0x540d7E428D5207B30EE03F2551Cbb5751D3c7569"
        );
        const result = await contract.methods
            .createCar(model)
            .send({ from: accounts[0] });
        const carAddress = result.events.CarCreated.returnValues[0];
        setCreatedCar(carAddress);
    };

    const handleRetrieveCarSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        const carFactoryContract = new web3.eth.Contract(
            ABI as any,
            "0x540d7E428D5207B30EE03F2551Cbb5751D3c7569"
        );
        const car = await carFactoryContract.methods.getCar(carIndex).call();
        const ourCarContract = new web3.eth.Contract(
            ABI as any,
            car.carAddress
        );
        setRetriveCar(ourCarContract);
    };

    return (
        <div>
            <h1>Car Factory</h1>
            <h2>Create Car</h2>
            <form onSubmit={handleCarSubmit}>
                <label>
                    Owner:
                    <input
                        type="text"
                        value={owner}
                        onChange={(event) => setOwner(event.target.value)}
                    />
                </label>
                <br />
                <label>
                    Model:
                    <input
                        type="text"
                        value={model}
                        onChange={(event) => setCarModel(event.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Create Car</button>
            </form>
            {createdCar && (
                <>
                    <h2>Created Car</h2>
                    <p>Owner: {createdCar.methods.owner().call()}</p>
                    <p>Model: {createdCar.methods.model().call()}</p>
                    <p>Address: {createdCar.options.address}</p>
                    <p>
                        Balance:{" "}
                        {web3.utils.fromWei(
                            await web3.eth.getBalance(createdCar.options.address)
                        )}{" "}
                        ETH
                    </p>
                </>
            )}
            <h2>Retrieve Car</h2>
            <form onSubmit={handleRetrieveCarSubmit}>
                <label>
                    Index:
                    <input
                        type="number"
                        value={carIndex}
                        onChange={(event) => setCarIndex(Number(event.target.value))}
                    />
                </label>
                <br />
                <button type="submit">Retrieve Car</button>
            </form>
            {retriveCar && (
                <>
                    <h2>Retrieved Car</h2>
                    <p>Owner: {retriveCar.methods.owner().call()}</p>
                    <p>Model: {retriveCar.methods.model().call()}</p>
                    <p>Address: {retriveCar.options.address}</p>
                    <p>
                        Balance:{" "}
                        {web3.utils.fromWei(
                            await web3.eth.getBalance(retriveCar.options.address)
                        )}{" "}
                        ETH
                    </p>
                </>
            )}
        </div>
    );
}

