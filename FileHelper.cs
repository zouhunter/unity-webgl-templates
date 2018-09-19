using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Events;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
public class FileHelper {
    [DllImport("__Internal")]
    public extern static void SaveFileAs(string path, string newFileName);
    [DllImport("__Internal")]
    public static extern void OpenUrlNewWindow(string url);
    [DllImport("__Internal")]
    public static extern void AlertInfomation(string str);
}
