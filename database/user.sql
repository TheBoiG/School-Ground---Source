# Host: localhost  (Version: 5.5.29-log)
# Date: 2022-06-07 10:22:36
# Generator: MySQL-Front 5.3  (Build 4.234)

/*!40101 SET NAMES utf8 */;

#
# Structure for table "user"
#

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

#
# Data for table "user"
#

/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (9,'123123','123123','1231'),(10,'yanghao','yanghao','156502669'),(11,'yanghaqo','yanghao','1565502669'),(12,'123','123','123'),(13,'yanghao123','yanghao123','15100117683'),(14,'123123123','123123','13133117683'),(15,'wanghu','123123','13333115687'),(16,'wanghu1','123123','15100113521'),(17,'undefined','undefined','undefined');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
