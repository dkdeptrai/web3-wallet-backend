const { default: axios } = require("axios");

const ETHERSCAN_API_BASE_URL = process.env.ETHERSCAN_API_BASE_URL;

exports.getContractAbi = async (req, res) => {
  try {
    const { contractAddress } = req.query;
    const response = await axios.get(
      `${ETHERSCAN_API_BASE_URL}&address=${contractAddress}&module=contract&action=getabi`
    );
    res.status(200).json(response.data.result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
