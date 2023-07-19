import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tenjin_rootstock_all/models/lesson_model.dart';
import 'package:tenjin_rootstock_all/services/user_service.dart';
import 'package:tenjin_rootstock_all/services/wallet_service.dart';

import '../../../services/auth_service.dart';
import '../../../services/teaching_material_service.dart';

class LearnController extends GetxController {
  final walletService = Get.put(WalletService());
  TeachingMaterialService teachingMaterialService = Get.put(TeachingMaterialService());
  RxList<Lesson> lessonList = <Lesson>[].obs;
  UserService userService = Get.find<UserService>();
  Rx<TextEditingController> invoiceController = TextEditingController().obs;

  bool get walletConnected => walletService.wallet != null;

  String get walletAddress => walletService.wallet!.address;

  redeem() async {
    print('object');
    await Get.put(AuthService()).redeem(1);
  }

  fetchLessonList() async {
    lessonList.value = (await teachingMaterialService.getAllLessons())..sort((a, b) => a.sequence.compareTo(b.sequence));
    /* var list = [
      {
        "id": 1,
        "is_completed": true,
        "classes": [
          {
            "id": 1,
            "title": "What is a Wallet?",
            "description": "235",
            "sequence": 1,
            "illustration_image": "https://tenjin-static-files.s3.amazonaws.com/lesson1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQJ5ENP7GEPERITWK%2F20230717%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20230717T123541Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDGV1LWNlbnRyYWwtMSJIMEYCIQCeIBgKnbZJLyKP3sZ5p%2BZTo9JU5Pq8CMcKZvCh7fs6vwIhAItini1IKw9jTuTRrU8%2BlmYd3At0mLOhObOxS7kzRK%2F3KrwFCF0QARoMMDIxMjgyNzgzMTgwIgxRGP56u64%2BaBve9sEqmQWiUVh0UlvT7ezVALGUeKRa6q5grype2O6ha%2FLMlTssTNfdsrJW79Uclu9TTNVbgR2hVWGrTmLY9u1JLegZhkscvyb4gboBEJFQhMnVXVBRIZXb%2BNpvf0FzSRubpLnZmpdzcgULoR22OclqsQldaSYItodRm9M5s%2BC1Ehw28yeYHtbNBsj3Ts18m1N%2FC23m1hEyhhp3%2F0FcVZ7oRM3wo3nhHwL0BBP15mDeRKxciiAEPLGwiGL9dyh3Dz0gCMq5vpG6cOJLVUux5wZ0J4Cc4SesG1nc6z3WIG1BUt%2BsSXNijk8j0BbBNCX4S0OdcObu2YrB5eodrRxfrUeOfKbnqlGCn1cTH1ftTLZf%2FhRXZpdrFVzpDQLBWOjmsBshf43fblR2eJpiFNRroLsaYdKJtqmEKvwgf4OFGzUbjFsdjMBuaz9TqlDIHD8VKYHl96%2FOkHWYcw4zvMUJh2ZneGA5wW41O4Uja220XEU9Wf6KIsTSvN3%2B8K%2Fb854xza6KbIQ5ia6f6f10nFiKL04yhr1vvp7L%2BDr51ozjJglOJueI0eKN5KXOHkRw5hrXR6rPlBzfNi3GphACOvJaAIgMyzZr05XYoS6JdSun2cNow4TL6PZkyUpUXw2%2B97z5ZJspP4caashlsH1OptKuhXQzO4y%2BZgPqLS%2B1ka%2BzqxNTvcAf6OUPAF3FlNN5k6P48Po4vSkMsVNhS8XUKK3dYMfEess1SdQ0q0PMGhfQWcy%2FPevdN4gVJTCRWe7vE0r9OCWtLZnCkKX%2FAXRMqlfwEbWKcO7BDLO7lfRv1h%2B7NsfMgNfTXdgw%2B1x1mrMk%2BgKargrf9Q6QxvBTF78wFhRYsrLuvHJjcG1EuNQra9oaF0qUNItdWhsmJtRaPv4tgOdvTzDP2NSlBjqwASTqXJS%2B5PNsGkNCSzWnWz%2B%2FDIDWquvTCLtuViR9Pz%2FwRjJjvb8weXuGGo41a%2Fi4fMuCGcZigNvQLsfE4wl%2BdTRmjbbs61akGXOn%2B1DV17a%2F20IKvScmx2y3keSzD36hyc%2BdSoM%2FAWNQOZOyaXCNIS4kpiMF7trNJAy47MjitdRTzucNYaxT1URjh6IH8V%2F%2Fy%2Bjt5Rqi9nOeyeRGbhWyVT6lLAmQkAcpC9bEVvheOX5Y&X-Amz-Signature=f32dbe9d7908ef8ce71ed3e031bcadb627189bef02f98b89ceedf6d744bb9f9f",
            "created_at": "2023-07-10T15:19:20.766387Z",
            "updated_at": "2023-07-11T13:14:42.374643Z",
            "lesson": 1,
            "is_completed": false,
            "is_started": true
          },
          {
            "id": 2,
            "title": "What is a seed phrase?",
            "description": "234",
            "sequence": 2,
            "illustration_image": "https://tenjin-static-files.s3.amazonaws.com/lesson2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQJ5ENP7GK4ZRCK55%2F20230717%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20230717T123554Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDGV1LWNlbnRyYWwtMSJGMEQCIE1GDGu9qLMjUxtxMnbjDM4Ki3HWrT7mw1b8%2Fo7q%2FRxkAiAPIQ%2F5me%2Fo4BgG0We2%2BoZ2O%2Fk3%2BKdLTAF1OiMWgHZ0Iyq9BQheEAEaDDAyMTI4Mjc4MzE4MCIMwcob3d2P0%2BiXmxIfKpoF9P%2BqMd5G11Gj5k2mK%2FhcQjfgiF7pjAv3HFIn6ipqtL89cam7lmeVpgxlhLec6nTd%2FmzYgsReDYUrgoELF5IHGmzwPG3WikhAVxfGvlL6djRA%2F6QsQzadfB4TKB9wijrI1t8yu5fY4f%2FNQp3AVFvcVwxeKWNUA8lFg14T0SOASaN13evCVPVn2vMo6NMrQ3d%2BzyRjoLsjHl%2BaiXyYLKxIWzK3bqQfkhKUAW3zDl4ls%2Fi%2B1GOc7N3oonxLtgB01tSXZjwEhfOyyZZYTfLGLWA56VjAB58y4TZ%2FlFMOvMAo1Afau4%2FHR3%2FxSWM2XVuDyKQuRd59b5PwXlIs1WCkL6FlKWdgxOhX5LA1vLvc5olxHm%2BIugbtjql8J8cPpx5SWYsurI0F0xQR3cbugNl7bLWqnq6jkqnbWOmZHh6SgUke0R2XTw1mDKN4OCnEc6DSfkYUUWi9nGeiuFi9jMvVFmiLtZc1AFRzLyHgwKvv%2FqwtNV4H%2F9ysaMOgoGIC29fMa3hY2Mk3HTz1eNe%2FSnb76CCcccTX%2B6vXYfeScRPofNsIeuEQmAw1q5nDj7%2BBNXRM8NSgs0t3EV9iLVhTHLF4k2QLuQ06GxmoFD2%2Fpgw9Wv52ymy9hy28oIE7S6fi8du3Q%2FeWgZVxp9qZLG7GmtvXrhQMNwjDOz9s7hMEznORaGq41Ece6rc4DGiPhKOy3S1zSWzED92LiYA4gx42aUblidBqNVNjWbOqvkZgDq3Vgb7ALg6wImxj6C3UzIWehOwFIcg5YfNsmFoYj5qm20Jlo42iNc%2BVFNDI0yVEL2bAMMHnJir4a80pIxQurppnrn44fRQFHIBNjUtdfYUeJo%2FjuFauavaO63qi9jqJzvGkqH%2BOOZWWBGVpzQ6ADPw7MNvn1KUGOrIB7QQm9lxsfxJ%2FiynsRE1eOJevYyTbQRqNiKt1zmjXRKu6Qr2llgeJmGYmQIUlf5M7ukDZb1rAMMIyiXaGuiVANpEG21NjCfMaqQlhHfedpN3BrT7rBAGvouYz9rbUWyvmbYPmr16wTZA602Vr3pVzvfUzQ43zdk1K7CxoyWeVTvKQDufuOOssWgUZogThAc4bhj5AanWetq0QM4LidfGwyB2wzPp08yiXVOn2XYndyTkOXg%3D%3D&X-Amz-Signature=65987263ad78559a8cd90cbe7ce58988c42e0f21f756e2d4a926b2d528a948ca",
            "created_at": "2023-07-10T15:28:15.975262Z",
            "updated_at": "2023-07-17T09:32:10.005336Z",
            "lesson": 1,
            "is_completed": false,
            "is_started": false,
          },
          {
            "id": 3,
            "title": "Setting up a wallet",
            "description": "dfgh",
            "sequence": 3,
            "illustration_image": "https://tenjin-static-files.s3.amazonaws.com/lesson3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQJ5ENP7GK4ZRCK55%2F20230717%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20230717T123726Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDGV1LWNlbnRyYWwtMSJGMEQCIE1GDGu9qLMjUxtxMnbjDM4Ki3HWrT7mw1b8%2Fo7q%2FRxkAiAPIQ%2F5me%2Fo4BgG0We2%2BoZ2O%2Fk3%2BKdLTAF1OiMWgHZ0Iyq9BQheEAEaDDAyMTI4Mjc4MzE4MCIMwcob3d2P0%2BiXmxIfKpoF9P%2BqMd5G11Gj5k2mK%2FhcQjfgiF7pjAv3HFIn6ipqtL89cam7lmeVpgxlhLec6nTd%2FmzYgsReDYUrgoELF5IHGmzwPG3WikhAVxfGvlL6djRA%2F6QsQzadfB4TKB9wijrI1t8yu5fY4f%2FNQp3AVFvcVwxeKWNUA8lFg14T0SOASaN13evCVPVn2vMo6NMrQ3d%2BzyRjoLsjHl%2BaiXyYLKxIWzK3bqQfkhKUAW3zDl4ls%2Fi%2B1GOc7N3oonxLtgB01tSXZjwEhfOyyZZYTfLGLWA56VjAB58y4TZ%2FlFMOvMAo1Afau4%2FHR3%2FxSWM2XVuDyKQuRd59b5PwXlIs1WCkL6FlKWdgxOhX5LA1vLvc5olxHm%2BIugbtjql8J8cPpx5SWYsurI0F0xQR3cbugNl7bLWqnq6jkqnbWOmZHh6SgUke0R2XTw1mDKN4OCnEc6DSfkYUUWi9nGeiuFi9jMvVFmiLtZc1AFRzLyHgwKvv%2FqwtNV4H%2F9ysaMOgoGIC29fMa3hY2Mk3HTz1eNe%2FSnb76CCcccTX%2B6vXYfeScRPofNsIeuEQmAw1q5nDj7%2BBNXRM8NSgs0t3EV9iLVhTHLF4k2QLuQ06GxmoFD2%2Fpgw9Wv52ymy9hy28oIE7S6fi8du3Q%2FeWgZVxp9qZLG7GmtvXrhQMNwjDOz9s7hMEznORaGq41Ece6rc4DGiPhKOy3S1zSWzED92LiYA4gx42aUblidBqNVNjWbOqvkZgDq3Vgb7ALg6wImxj6C3UzIWehOwFIcg5YfNsmFoYj5qm20Jlo42iNc%2BVFNDI0yVEL2bAMMHnJir4a80pIxQurppnrn44fRQFHIBNjUtdfYUeJo%2FjuFauavaO63qi9jqJzvGkqH%2BOOZWWBGVpzQ6ADPw7MNvn1KUGOrIB7QQm9lxsfxJ%2FiynsRE1eOJevYyTbQRqNiKt1zmjXRKu6Qr2llgeJmGYmQIUlf5M7ukDZb1rAMMIyiXaGuiVANpEG21NjCfMaqQlhHfedpN3BrT7rBAGvouYz9rbUWyvmbYPmr16wTZA602Vr3pVzvfUzQ43zdk1K7CxoyWeVTvKQDufuOOssWgUZogThAc4bhj5AanWetq0QM4LidfGwyB2wzPp08yiXVOn2XYndyTkOXg%3D%3D&X-Amz-Signature=1511e8e904ea2608a813deea0ce5fe588c3b49d5d5558927b7cc66b11c8b5162",
            "created_at": "2023-07-10T15:32:43.892515Z",
            "updated_at": "2023-07-17T09:32:45.533097Z",
            "lesson": 1,
            "is_completed": false,
            "is_started": false,
          }
        ],
        "title": "Create your own wallet",
        "description": "Secure your digital fortune: learn how to set up your personal bitcoin wallet",
        "sequence": 1,
        "created_at": "2023-07-10T15:16:48.549912Z",
        "updated_at": "2023-07-11T12:58:24.669519Z",
        "chapter": 1
      },
      {
        "id": 2,
        "is_completed": false,
        "classes": [],
        "title": "The world of Rootstock",
        "description": "Unleash the power of smart contracts on bitcoin's revolutionary sidechain: explore Rootstock (RSK)",
        "sequence": 2,
        "created_at": "2023-07-11T12:57:56.145533Z",
        "updated_at": "2023-07-11T13:09:35.387648Z",
        "chapter": 1
      }
    ];
    lessonList.value = (List.generate(list.length, (index) => Lesson.fromJson(list[index])))..sort((a, b) => a.sequence.compareTo(b.sequence));
    */
  }
}
