import { ethers, BigNumber } from "ethers";
import { message } from "antd";
import { chainId, secretKeys, busdContractAddress, providers } from "../constants/const";
import busdContractABI from "../constants/busdContractABI.json";

export const getWalletAddress = () => {
    const addresses = secretKeys.map((key) => {
        const wallet = new ethers.Wallet(key);
        return wallet.address;
    });

    return addresses;
}

export const tokenTransfer = async (index, receiver, amount, token) => {
    const providerInfo = providers.TEST;
    const wallet = new ethers.Wallet(secretKeys[index]);
    const newAmount = BigNumber.from(1e9).mul(BigNumber.from(1e9)).mul(amount * 10000).div(10000);
    const provider = ethers.getDefaultProvider(providerInfo.url);
    const connectedWallet = wallet.connect(provider);

    if (token === "BUSD") {
        const contract = new ethers.Contract(busdContractAddress, busdContractABI, connectedWallet);
        try {
            const tx = await contract.transfer(receiver, newAmount);
            let res = await tx.wait();
            if (res.transactionHash) {
                return true;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    if (token === "ETH") {
        const transaction = {
            to: receiver,
            value: newAmount,
            data: '0x',
            chainId: providerInfo.chainId
        }
    
        try {
            const tx = await connectedWallet.sendTransaction(transaction);
            let res = await tx.wait();
            if (res.transactionHash) {
                return true;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

}