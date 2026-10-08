import 'package:dio/dio.dart';
import '../constants/api_constants.dart';

/// Shared HTTP client for all API calls.
/// Configured with base URL, timeouts, and request/response logging.
/// JWT interceptor will be added after the Auth module is built.
class ApiClient {
  late final Dio _dio;

  ApiClient() {
    _dio = Dio(
      BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        connectTimeout: ApiConstants.connectTimeout,
        receiveTimeout: ApiConstants.receiveTimeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Request & response logging (debug only)
    _dio.interceptors.add(
      LogInterceptor(
        requestBody: true,
        responseBody: true,
        logPrint: (log) => print('[API] $log'),
      ),
    );

    // TODO: Add JWT interceptor after Auth module is built
    // _dio.interceptors.add(InterceptorsWrapper(
    //   onRequest: (options, handler) {
    //     final token = tokenStorage.getAccessToken();
    //     if (token != null) {
    //       options.headers['Authorization'] = 'Bearer $token';
    //     }
    //     handler.next(options);
    //   },
    //   onError: (error, handler) {
    //     if (error.response?.statusCode == 401) {
    //       // Refresh token logic here
    //     }
    //     handler.next(error);
    //   },
    // ));
  }

  /// GET request
  Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParams,
  }) =>
      _dio.get(path, queryParameters: queryParams);

  /// POST request
  Future<Response> post(
    String path, {
    dynamic data,
  }) =>
      _dio.post(path, data: data);

  /// PATCH request
  Future<Response> patch(
    String path, {
    dynamic data,
  }) =>
      _dio.patch(path, data: data);

  /// PUT request
  Future<Response> put(
    String path, {
    dynamic data,
  }) =>
      _dio.put(path, data: data);

  /// DELETE request
  Future<Response> delete(String path) => _dio.delete(path);

  /// Multipart file upload (for profile photos, AI hair images)
  Future<Response> upload(
    String path, {
    required FormData formData,
  }) =>
      _dio.post(path, data: formData);
}
