import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:web3dart/web3dart.dart';

class ChainService extends GetxService {
  final int testnetChainId = 31;
  final int mainNetChainId = 30;
  Web3Client testnetClient = Web3Client('https://public-node.testnet.rsk.co', http.Client());
  Web3Client mainnetClient = Web3Client('https://public-node.rsk.co', http.Client());
}
