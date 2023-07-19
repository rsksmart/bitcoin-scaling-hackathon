import 'dart:convert';
import 'dart:io';

import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:tenjin_rootstock_all/models/class_model.dart';
import 'package:tenjin_rootstock_all/services/auth_service.dart';

import '../models/lesson_model.dart';
import '../utils/constants.dart';

class TeachingMaterialService extends GetxService {
  AuthService authService = Get.find<AuthService>();

  Future<List<Lesson>> getAllLessons() async {
    print("GetAllLessons - starting getting all lessons");
    var url = Uri.parse('${Constants.domain}/api/lesson/');

    final response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        HttpHeaders.authorizationHeader: "Bearer ${authService.authenticationToken}"
      },
    );
    print("GetAllLessons - got response");

    if (response.statusCode == 200) {
      List jsonMap = jsonDecode(response.body);
      return List.generate(jsonMap.length, (index) => Lesson.fromJson(jsonMap[index]));
    } else {
      print('Error while getting all lessons with status code ${response.statusCode}');
      throw ("GetAllLessons - error while getting all lessons in with status code ${response.statusCode}");
    }
  }

  Future<Class> getQuestionsFromClass(int classId) async {
    print("GetQuestionsFromClass - starting getting all questions from a class");
    var url = Uri.parse('${Constants.domain}/api/class/$classId/questions/');

    final response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        HttpHeaders.authorizationHeader: "Bearer ${authService.authenticationToken}"
      },
    );
    print("GetQuestionsFromClass - got response");

    if (response.statusCode == 200) {
      List jsonMap = jsonDecode(response.body);
      return Class.fromJson(jsonMap[0]);
    } else {
      print('Error while getting all lessons with status code ${response.statusCode}');
      throw ("GetQuestionsFromClass - error while getting all lessons in with status code ${response.statusCode}");
    }
  }

  Future<Lesson> getLesson(int lessonId) async {
    print("GetLesson - starting Lesson");
    var url = Uri.parse('${Constants.domain}/api/lesson/$lessonId/');

    final response = await http.get(
      url,
      headers: {
        "Content-Type": "application/json",
        HttpHeaders.authorizationHeader: "Bearer ${authService.authenticationToken}"
      },
    );

    print("GetLesson - got response");

    if (response.statusCode == 200) {
      try {
        Map<String, dynamic> userMap = jsonDecode(response.body);
        return Lesson.fromJson(userMap);
      } catch (error) {
        print("GetLesson - error while parsing the user: $error");
        throw ("GetLesson - error while parsing the user: $error");
      }
    } else {
      print("GetLesson - error while registering the user with statusCode ${response.body}");
      throw ("GetLesson - error while registering the user with statusCode ${response.body}");
    }
  }

  Future<bool> startCategoryById(int categoryId) async {
    print("StartCategoryById - starting startCategoryById");
    var url = Uri.parse('${Constants.domain}/api/lesson/start/category/');
    var body = json.encode({
      "category_id": 1
    });

    final response = await http.post(url,
        headers: {
          "Content-Type": "application/json",
          HttpHeaders.authorizationHeader: "Bearer ${authService.authenticationToken}"
        },
        body: body);

    print("StartCategoryById - got response");

    if (response.statusCode == 201) {
      return true;
    } else {
      print("StartCategoryById - error while registering the user with statusCode ${response.body}");
      return false;
    }
  }

  Future<Map> getClassScore(int classId) async {
    print("getClassScore - starting getClassScore");
    var url = Uri.parse('${Constants.domain}/api/class-attempt/end-class/$classId/');

    final response = await http.patch(url, headers: {
      "Content-Type": "application/json",
      HttpHeaders.authorizationHeader: "Bearer ${authService.authenticationToken}"
    });
    print("getClassScore - got response");

    if (response.statusCode == 200) {
      try {
        Map<String, dynamic> userMap = jsonDecode(response.body);
        return userMap;
      } catch (error) {
        throw "getClassScore - error while parsing the user: $error";
      }
    } else {
      throw "getClassScore - error while registering the user with statusCode ${response.body}";
    }
  }

  Future<bool> addClassRecord(int questionId, int answerId) async {
    print("AddClassRecord - starting addClassRecord");
    var url = Uri.parse('${Constants.domain}/api/class-record/new/');
    var body = json.encode({
      "question": questionId,
      "selected_answer": answerId,
    });
    final response = await http.post(url,
        headers: {
          "Content-Type": "application/json",
          HttpHeaders.authorizationHeader: "Bearer ${authService.authenticationToken}"
        },
        body: body);
    print("AddClassRecord - got response");

    if (response.statusCode == 201) {
      try {
        jsonDecode(response.body);
        return true;
      } catch (error) {
        throw "AddClassRecord - error while parsing the user: $error";
      }
    } else {
      throw "AddClassRecord - error while registering the user with statusCode ${response.body}";
    }
  }
}
